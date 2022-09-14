import { extractBearerToken } from "src/utils/helpers/extractBearerToken";
import { jwtConstants } from "../constants";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Request } from "express";
import JwtDto from "../dto/jwt.dto";

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
