import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { BadGatewayException, Injectable } from "@nestjs/common";
import UserEntity from "../user/entities/user.entity";
import UserRepository from "../user/user.repository";
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";
import { instanceToInstance } from "class-transformer";

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

  async logout({ username }: any, accessToken: string) {
    const accessTokens = await this.redis.smembers(username);
    const [token] = accessTokens.filter((t) => accessToken === t);
    const removed = await this.redis.srem(username, token);
    if (removed === 0) {
      throw new BadGatewayException(
        "Could not remove session, please try again later.",
      );
    }

    return true;
  }

  async logoutAll({ username }: any) {
    const accessTokens = await this.redis.smembers(username);
    const removed = await this.redis.srem(username, accessTokens);
    if (removed === 0) {
      throw new BadGatewayException(
        "Could not remove sessions, please try again later.",
      );
    }

    return true;
  }

  async login(user: Omit<UserEntity, "password">) {
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

    const now = Math.floor(Date.now() / 1000);

    const activeSessions = sessions.filter((s: any) => {
      const session = this.jwtService.decode(s) as any;
      if (session.exp < now) {
        return false;
      }
      return true;
    });

    const unActiveSessions = sessions.filter((s: any) => {
      const session = this.jwtService.decode(s) as any;
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
