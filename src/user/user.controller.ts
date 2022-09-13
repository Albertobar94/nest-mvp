import { AuthService } from "./../auth/auth.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { isResourceOwnerGuard } from "./../product/guards/is-resource-owner.guard";
import { ParseIntPipe } from "./../pipes/parse-int.pipe";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                               Get User By Id                               */
  /* -------------------------------------------------------------------------- */
  @ApiTags("User")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The record has been successfully fetched.",
    type: [UserEntity],
  })
  @UseGuards(JwtAuthGuard, isResourceOwnerGuard)
  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) id: number) {
    const { user } = await this.userService.getUser(id);

    return {
      user,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Create User                                */
  /* -------------------------------------------------------------------------- */
  @ApiTags("User")
  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: [UserEntity],
  })
  @HttpCode(201)
  @Post()
  async postUser(@Body() data: CreateUserDto) {
    const { user } = await this.userService.postUser(data);

    return {
      user,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Delete User                                */
  /* -------------------------------------------------------------------------- */
  @ApiTags("User")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiNoContentResponse({
    description: "The record has been successfully deleted.",
  })
  @UseGuards(JwtAuthGuard, isResourceOwnerGuard)
  @HttpCode(204)
  @Delete("/:id")
  async deleteUser(
    @Param("id", ParseIntPipe) id: UserEntity["id"],
    @Request() req: any,
  ) {
    await this.userService.deleteUser(id);
    await this.authService.logoutAll(req.user);

    return;
  }
}
