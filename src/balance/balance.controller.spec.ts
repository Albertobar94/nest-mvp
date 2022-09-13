import { Test, TestingModule } from "@nestjs/testing";
import { BalanceController } from "./balance.controller";
import BalanceRepository from "./balance.repository";
import { BalanceService } from "./balance.service";

describe("BalanceController", () => {
  let controller: BalanceController;
  const FakeBalanceService: Partial<BalanceService> = {};
  const FakeBalanceRepository: Partial<BalanceRepository> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        { provide: BalanceService, useValue: FakeBalanceService },
        { provide: BalanceRepository, useValue: FakeBalanceRepository },
      ],
    }).compile();

    controller = module.get<BalanceController>(BalanceController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
