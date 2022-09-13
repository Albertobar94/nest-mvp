import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";
import { ALLOWED_COINS } from "../../constants/allowed-coins.constant";

export class AmountDto {
  @ApiProperty()
  @IsIn(ALLOWED_COINS)
  @IsNotEmpty()
  amount: number;
}

export default AmountDto;
