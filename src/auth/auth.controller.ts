import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtDto } from "./dto/jwt-payload.dto";
import { LoginDto } from "./dto/login-request.dto";
import { AuthService } from "./auth.service";
import { LoggedInDto } from "./dto/login-response.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { extractBearerToken } from "../utils/helpers/extractBearerToken";

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
  async login(
    @Request() req: Request & { user: JwtDto },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: LoginDto,
  ) {
    const { accessToken, message } = await this.authService.login(req.user);

    return {
      accessToken,
      message,
    };
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
  async logout(
    @Request()
    req: Request & { user: JwtDto; headers: Record<string, any> },
  ) {
    await this.authService.logout(
      req.user,
      extractBearerToken(req.headers.authorization),
    );

    return;
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
  async logoutAll(@Request() req: Request & { user: JwtDto }) {
    await this.authService.logoutAll(req.user);

    return;
  }
}
