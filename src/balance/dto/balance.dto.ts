import { IsIn, IsNotEmpty } from "class-validator";
import { ALLOWED_COINS } from "../../constants/allowed-coins.constant";

export class BalanceDto {
  @IsIn(ALLOWED_COINS)
  @IsNotEmpty()
  amount: number;
}

export default BalanceDto;
