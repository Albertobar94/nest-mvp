import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class PurchaseDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  total: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  sellerId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  buyerId: number;

  @IsNumber({}, { each: true })
  @IsNotEmpty()
  change: number[];
}

export default PurchaseDto;
