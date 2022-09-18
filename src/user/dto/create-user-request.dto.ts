import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Matches, Length } from "class-validator";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 256)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @Length(4, 32)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @Matches("^seller|buyer$")
  @IsNotEmpty()
  role: "seller" | "buyer";
}

export default CreateUserDto;
