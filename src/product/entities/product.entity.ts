import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ProductEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  cost: number;

  @ApiProperty()
  @Expose()
  amountAvailable: number;

  @ApiProperty()
  @Expose()
  sellerId: number;
}

export default ProductEntity;
