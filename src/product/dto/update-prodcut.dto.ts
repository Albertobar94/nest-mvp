import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsMultipleOf } from "../../utils/decorators";
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
} from "class-validator";

export class UpdateProductDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @IsNotEmpty()
  amountAvailable: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsMultipleOf(5)
  @IsPositive()
  @IsOptional()
  @IsNotEmpty()
  cost: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;
}

export default UpdateProductDto;
