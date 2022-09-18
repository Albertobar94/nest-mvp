import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { Injectable } from "@nestjs/common";
import { UserEntity } from "./entities/user.entity";
import { plainToInstance } from "class-transformer";
import { UpdateUserDto } from "./dto/update-user-request.dto";
import { CreateUserDto } from "./dto/create-user-request.dto";

@Injectable()
export class UserRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getUser(id: number) {
    const user = await this.knex
      .from<UserEntity>("user")
      .select()
      .where("id", id);

    return user.map((user) => {
      return plainToInstance(UserEntity, user, {
        excludeExtraneousValues: true,
      });
    });
  }

  async _getByUsername(username: string) {
    const user = await this.knex
      .from<UserEntity>("user")
      .select()
      .where("username", username);

    return user.map((user) => {
      return plainToInstance(UserEntity, user, {
        ignoreDecorators: true,
        strategy: "exposeAll",
      });
    });
  }

  async insertUser(data: CreateUserDto) {
    const user = await this.knex
      .from<UserEntity>("user")
      .insert({ ...data }, "*");

    return user.map((user) => {
      return plainToInstance(UserEntity, user, {
        excludeExtraneousValues: true,
      });
    });
  }

  async updateUser(id: number, { username }: UpdateUserDto) {
    const user = await this.knex
      .from<UserEntity>("user")
      .update({ username }, "*")
      .where("id", id);

    return user.map((user) => {
      return plainToInstance(UserEntity, user, {
        excludeExtraneousValues: true,
      });
    });
  }

  async deleteUser(id: number) {
    return this.knex.from<UserEntity>("user").delete().where("id", id);
  }
}

export default UserRepository;
