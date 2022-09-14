import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(id: number): Promise<Record<string, UserEntity[]>> {
    const user = await this.userRepository.getUser(id);

    return {
      user,
    };
  }

  async postUser(data: CreateUserDto): Promise<Record<string, UserEntity[]>> {
    const password = await bcrypt.hash(
      data.password,
      Number(process.env.BCRYPT_ROUNDS) || 10,
    );
    const user = await this.userRepository.insertUser({ ...data, password });

    return {
      user,
    };
  }

  async putUser(
    id: number,
    data: CreateUserDto,
  ): Promise<Record<string, UserEntity[]>> {
    const user = await this.userRepository.updateUser(id, data);

    return {
      user,
    };
  }

  async deleteUser(id: number): Promise<number> {
    return this.userRepository.deleteUser(id);
  }
}
