import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, Length } from "class-validator";

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @Length(3, 256)
  @IsNotEmpty()
  username: string;
}

export default UpdateUserDto;
