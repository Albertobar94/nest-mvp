import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { IsMultipleOf } from "../../utils/decorators";

export class CreateProductDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amountAvailable: number;

  @ApiProperty()
  @IsNumber()
  @IsMultipleOf(5)
  @IsPositive()
  @IsNotEmpty()
  cost: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}

export default CreateProductDto;
