import { ApiProperty } from "@nestjs/swagger";
import { IsMultipleOf } from "../../utils/decorators";
import { IsString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class ProductDto {
  // Swagger
  @ApiProperty()
  // Validation
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amountAvailable: number;

  // Swagger
  @ApiProperty()
  // Validation
  @IsNumber()
  @IsMultipleOf(5)
  @IsPositive()
  @IsNotEmpty()
  cost: number;

  // Swagger
  @ApiProperty()
  // Validation
  @IsString()
  @IsNotEmpty()
  name: string;
}

export default ProductDto;
