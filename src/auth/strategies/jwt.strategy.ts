import { Request } from "express";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtDto } from "../dto/jwt.dto";
import { jwtConstants } from "../constants";
import { AuthService } from "../auth.service";
import { extractBearerToken } from "../../utils/helpers/extractBearerToken";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtDto) {
    const accessToken = extractBearerToken(req.headers.authorization as string);
    const isValid = await this.authService.validateUserAgainstRedis(
      accessToken,
      payload,
    );
    if (!isValid) {
      return null;
    }
    return payload;
  }
}
