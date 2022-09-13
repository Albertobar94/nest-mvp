import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { Controller, HttpCode, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import {
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { extractBearerToken } from "../utils/helpers/extractBearerToken";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags("Auth")
  @ApiOkResponse({
    description: "The user has been successfully logged in.",
  })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @ApiTags("Auth")
  @ApiNoContentResponse({
    description: "The user has been successfully logged out.",
  })
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Request() req: any) {
    return this.authService.logout(
      req.user,
      extractBearerToken(req.headers["authorization"]),
    );
  }

  @ApiTags("Auth")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiNoContentResponse({
    description: "The user has been successfully logged out from all sessions.",
  })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Post("logout/all")
  async logoutAll(@Request() req: any) {
    return this.authService.logoutAll(req.user);
  }
}
