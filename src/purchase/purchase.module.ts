import { Module } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { ProductModule } from "../product/product.module";
import { DepositModule } from "../deposit/deposit.module";
import { PurchaseController } from "./purchase.controller";
import { PurchaseRepository } from "./purchase.repository";

@Module({
  imports: [ProductModule, DepositModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseRepository],
})
export class PurchaseModule {}
