import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
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
import { UserService } from "./user.service";
import { UserEntity } from "./entities/user.entity";
import { AuthService } from "./../auth/auth.service";
import { UpdateUserDto } from "./dto/update-user-request.dto";
import { CreateUserDto } from "./dto/create-user-request.dto";
import { ParseIntPipe } from "./../pipes/parse-int.pipe";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { isResourceOwnerGuard } from "./../product/guards/is-resource-owner.guard";

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
  /*                                 Update User                                */
  /* -------------------------------------------------------------------------- */
  @ApiTags("User")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The record has been successfully updated.",
    type: [UserEntity],
  })
  @UseGuards(JwtAuthGuard, isResourceOwnerGuard)
  @Put("/:id")
  async putProduct(
    @Body() data: UpdateUserDto,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const { user } = await this.userService.putUser(id, data);

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
