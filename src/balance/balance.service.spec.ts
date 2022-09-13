import { BalanceService } from "./balance.service";
import { Test, TestingModule } from "@nestjs/testing";
import { BalanceRepository } from "./balance.repository";

describe("BalanceService", () => {
  let service: BalanceService;
  const FakeBalanceService: Partial<BalanceService> = {};
  const FakeBalanceRepository: Partial<BalanceRepository> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: BalanceService, useValue: FakeBalanceService },
        { provide: BalanceRepository, useValue: FakeBalanceRepository },
      ],
    }).compile();

    service = module.get<BalanceService>(BalanceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
