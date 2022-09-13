import { Module } from "@nestjs/common";
import { PurchaseService } from "./purchase.service";
import { PurchaseController } from "./purchase.controller";
import { PurchaseRepository } from "./purchase.repository";
import { BalanceModule } from "../balance/balance.module";
import { ProductModule } from "../product/product.module";

@Module({
  imports: [ProductModule, BalanceModule],
  controllers: [PurchaseController],
  providers: [PurchaseService, PurchaseRepository],
})
export class PurchaseModule {}