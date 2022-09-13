import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class UserEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @Exclude()
  password: string;

  @ApiProperty()
  @Expose()
  deposit: number;

  @ApiProperty()
  @Expose()
  role: "seller" | "buyer";
}

export default UserEntity;
