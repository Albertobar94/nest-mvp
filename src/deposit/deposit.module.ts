import { Module } from "@nestjs/common";
import { DepositService } from "./deposit.service";
import { DepositRepository } from "./deposit.repository";
import { DepositController } from "./deposit.controller";

@Module({
  exports: [DepositRepository],
  controllers: [DepositController],
  providers: [DepositService, DepositRepository],
})
export class DepositModule {}
