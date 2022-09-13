import { AuthModule } from "src/auth/auth.module";
import { forwardRef, Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import UserRepository from "./user.repository";
import { UserService } from "./user.service";

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
