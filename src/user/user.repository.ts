import { Knex } from "knex";
import { UserDto } from "./dto/user.dto";
import { InjectModel } from "nest-knexjs";
import { UserEntity } from "./entities/user.entity";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

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

  async insertUser(data: UserDto) {
    const user = await this.knex
      .from<UserEntity>("user")
      .insert({ ...data }, "*");

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
