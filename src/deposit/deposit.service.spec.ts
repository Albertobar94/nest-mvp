import { Test, TestingModule } from "@nestjs/testing";
import { DepositService } from "./deposit.service";
import { DepositRepository } from "./deposit.repository";

describe("DepositService", () => {
  let service: DepositService;
  const FakeDepositService = {
    addDeposit: jest.fn(),
    resetDeposit: jest.fn(),
  };
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

  it("should add to deposit", async () => {
    FakeDepositService.addDeposit.mockResolvedValue({ deposit: 100 });

    const response = await service.addDeposit(1, 100);

    expect(response).toEqual({ deposit: 100 });
  });

  it("should reset deposit", async () => {
    FakeDepositService.resetDeposit.mockResolvedValue({ deposit: 0 });

    const response = await service.resetDeposit(1);

    expect(response).toEqual({ deposit: 0 });
  });
});
