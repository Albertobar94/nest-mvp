import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches, Length } from "class-validator";

export class UserDto {
  // Swagger
  @ApiProperty()
  // Validation
  @IsString()
  @Length(3, 256)
  @IsNotEmpty()
  username: string;

  // Swagger
  @ApiProperty()
  // Validation
  @IsString()
  @Length(4, 32)
  @IsNotEmpty()
  password: string;

  // Swagger
  @ApiProperty()
  // Validation
  @IsString()
  @Matches("^seller|buyer$")
  @IsNotEmpty()
  role: "seller" | "buyer";
}

export default UserDto;
