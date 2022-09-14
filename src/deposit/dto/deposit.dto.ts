import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class DepositDto {
  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  deposit: number;
}

export default DepositDto;
