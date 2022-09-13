import { ParseIntPipe } from "./../pipes/parse-int.pipe";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserDto } from "./dto/user.dto";
import { UserEntity } from "./entities/user.entity";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @Get()
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
  async postUser(@Body() data: UserDto) {
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
  @HttpCode(204)
  @Delete("/:id")
  async deleteUser(@Param("id", ParseIntPipe) id: UserEntity["id"]) {
    await this.userService.deleteUser(id);

    return;
  }
}
