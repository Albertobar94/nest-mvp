import { Module } from "@nestjs/common";
import { BalanceService } from "./balance.service";
import { BalanceRepository } from "./balance.repository";
import { BalanceController } from "./balance.controller";

@Module({
  exports: [BalanceRepository],
  controllers: [BalanceController],
  providers: [BalanceService, BalanceRepository],
})
export class BalanceModule {}
