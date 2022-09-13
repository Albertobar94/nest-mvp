import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import {
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { extractBearerToken } from "../utils/helpers/extractBearerToken";
import { LoggedInDto } from "./dto/logged-in.dto";
import LoginDto from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* -------------------------------------------------------------------------- */
  /*                                    Login                                   */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Auth")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The user has been successfully logged in.",
    type: LoggedInDto,
  })
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any, @Body() _: LoginDto) {
    return this.authService.login(req.user);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Logout                                   */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Auth")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiNoContentResponse({
    description: "The user has been successfully logged out.",
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

  /* -------------------------------------------------------------------------- */
  /*                                 Logout All                                 */
  /* -------------------------------------------------------------------------- */
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
