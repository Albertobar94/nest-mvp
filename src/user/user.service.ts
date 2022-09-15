import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: number) {
    const user = await this.userRepository.getUser(id);

    return {
      user,
    };
  }

  async postUser(data: CreateUserDto) {
    const password = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_ROUNDS) || 10,
    );
    const user = await this.userRepository.insertUser({ ...data, password });

    return {
      user,
    };
  }

  async putUser(id: number, data: UpdateUserDto) {
    const user = await this.userRepository.updateUser(id, data);

    return {
      user,
    };
  }

  async deleteUser(id: number) {
    await this.userRepository.deleteUser(id);

    return;
  }
}
