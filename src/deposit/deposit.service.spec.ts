import { DepositService } from "./deposit.service";
import { Test, TestingModule } from "@nestjs/testing";
import { DepositRepository } from "./deposit.repository";

describe("DepositService", () => {
  let service: DepositService;
  const FakeDepositService = {};
  const FakeDepositRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DepositService, useValue: FakeDepositService },
        { provide: DepositRepository, useValue: FakeDepositRepository },
      ],
    }).compile();

    service = module.get<DepositService>(DepositService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
