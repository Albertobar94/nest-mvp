import { Module } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { PurchaseController } from "./purchase.controller";
import { PurchaseRepository } from "./purchase.repository";
import { DepositModule } from "../deposit/deposit.module";
import { ProductModule } from "../product/product.module";

@Module({
  imports: [ProductModule, DepositModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseRepository],
})
export class PurchaseModule {}
