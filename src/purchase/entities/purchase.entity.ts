import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PurchaseEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  total: number;

  @ApiProperty()
  @Expose()
  itemId: number;

  @ApiProperty()
  @Expose()
  itemName: string;

  @ApiProperty()
  @Expose()
  itemCost: number;

  @ApiProperty()
  @Expose()
  itemsTotal: number;

  @ApiProperty()
  @Expose()
  sellerId: number;

  @ApiProperty()
  @Expose()
  buyerId: number;
}

export default PurchaseEntity;
