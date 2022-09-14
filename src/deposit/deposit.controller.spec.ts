import { Test, TestingModule } from "@nestjs/testing";
import { DepositService } from "./deposit.service";
import { DepositController } from "./deposit.controller";
import { DepositRepository } from "./deposit.repository";

describe("DepositController", () => {
  let controller: DepositController;
  const FakeDepositService = {
    addDeposit: jest.fn(),
    resetDeposit: jest.fn(),
  };
  const FakeDepositRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepositController],
      providers: [
        { provide: DepositService, useValue: FakeDepositService },
        { provide: DepositRepository, useValue: FakeDepositRepository },
      ],
    }).compile();

    controller = module.get<DepositController>(DepositController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should add deposit", async () => {
    FakeDepositService.addDeposit.mockResolvedValue({ deposit: 100 });

    const response = await controller.addDeposit(
      { amount: 100 },
      { user: { id: 1 } },
    );

    expect(FakeDepositService.addDeposit).toHaveBeenCalledWith(1, 100);
    expect(response).toEqual({ deposit: 100 });
  });

  it("should reset deposit", async () => {
    FakeDepositService.resetDeposit.mockResolvedValue({ deposit: 0 });

    const response = await controller.resetDeposit({ user: { id: 1 } });

    expect(FakeDepositService.resetDeposit).toHaveBeenCalledWith(1);
    expect(response).toEqual({ deposit: 0 });
  });
});
