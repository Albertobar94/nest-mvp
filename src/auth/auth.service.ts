import Redis from "ioredis";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { instanceToInstance } from "class-transformer";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtDto } from "./dto/jwt-payload.dto";
import { UserRepository } from "../user/user.repository";
import { UserEntity } from "../user/entities/user.entity";
import { ONE_THOUSAND_MS } from "./constants/time-constants.constant";

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateUserAgainstDB(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const [user] = await this.userRepository._getByUsername(username);
    if (!user) {
      return null;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return null;
    }

    return instanceToInstance(user, {
      excludeExtraneousValues: true,
    });
  }

  async validateUserAgainstRedis(accessToken: string, { username }: JwtDto) {
    const accessTokens = await this.redis.smembers(username);
    if (!accessTokens.length) {
      throw new UnauthorizedException();
    }

    const [token] = accessTokens.filter((t) => accessToken === t);
    if (!token) {
      throw new UnauthorizedException();
    }

    return true;
  }

  async logout({ username }: JwtDto, accessToken: string) {
    const removed = await this.redis.srem(username, accessToken);
    if (removed === 0) {
      throw new BadGatewayException(
        "Could not remove session, please try again later.",
      );
    }

    return true;
  }

  async logoutAll({ username }: JwtDto) {
    const accessTokens = await this.redis.smembers(username);

    const removed = await this.redis.srem(username, accessTokens);
    if (removed === 0) {
      throw new BadGatewayException(
        "Could not remove sessions, please try again later.",
      );
    }

    return true;
  }

  async login(user: JwtDto) {
    const accessToken = this.jwtService.sign({
      id: user.id,
      username: user.username,
      role: user.role,
    });

    const saved = await this.redis.sadd(user.username, accessToken);
    if (saved === 0) {
      throw new BadGatewayException(
        "Could not save session, please try again.",
      );
    }

    const sessions = await this.redis.smembers(user.username);
    if (sessions.length === 1) {
      return { accessToken };
    }

    const now = Math.floor(Date.now() / ONE_THOUSAND_MS);

    const activeSessions = sessions.filter((s: string) => {
      const session = this.jwtService.decode(s) as Record<string, any>;
      if (session.exp < now) {
        return false;
      }
      return true;
    });

    const unActiveSessions = sessions.filter((s: string) => {
      const session = this.jwtService.decode(s) as Record<string, any>;
      if (session.exp < now) {
        return true;
      }
      return false;
    });

    if (unActiveSessions.length) {
      await this.redis.srem(user.username, unActiveSessions);
    }

    if (activeSessions.length > 1) {
      return {
        accessToken,
        message: "There is already an active session using your account!",
      };
    }

    return { accessToken };
  }
}
