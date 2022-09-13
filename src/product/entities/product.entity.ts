import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ProductEntity {
  // Swagger
  @ApiProperty()
  // Transformer
  @Expose()
  id: number;

  // Swagger
  @ApiProperty()
  // Transformer
  @Expose()
  name: string;

  // Swagger
  @ApiProperty()
  // Transformer
  @Expose()
  cost: number;

  // Swagger
  @ApiProperty()
  // Transformer
  @Expose()
  amountAvailable: number;

  // Swagger
  @ApiProperty()
  // Transformer
  @Expose()
  sellerId: number;
}

export default ProductEntity;
