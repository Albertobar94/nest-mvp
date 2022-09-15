import { Knex } from "knex";
import { ConflictException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { DepositRepository } from "./deposit.repository";

describe("DepositService", () => {
  let repository: DepositRepository;

  const FakeDepositRepository = {
    getDeposit: jest.fn(),
    addDeposit: jest.fn(),
    resetDeposit: jest.fn(),
    transferDeposit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: DepositRepository, useValue: FakeDepositRepository },
      ],
    }).compile();

    repository = module.get<DepositRepository>(DepositRepository);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  it("should add to deposit", async () => {
    FakeDepositRepository.addDeposit.mockResolvedValue({ deposit: 100 });

    const response = await repository.addDeposit(1, 100);

    expect(response).toEqual({ deposit: 100 });
  });

  it("should reset deposit", async () => {
    FakeDepositRepository.resetDeposit.mockResolvedValue({ deposit: 0 });

    const response = await repository.resetDeposit(1);

    expect(response).toEqual({ deposit: 0 });
  });

  it("should get deposit", async () => {
    FakeDepositRepository.getDeposit.mockResolvedValue({ deposit: 100 });

    const response = await repository.getDeposit(1);

    expect(response).toEqual({ deposit: 100 });
  });

  it("should transfer deposit", async () => {
    const trx = jest.fn() as unknown as Knex.Transaction;
    FakeDepositRepository.transferDeposit.mockResolvedValue({
      buyersDeposit: 50,
      sellersDeposit: 150,
    });

    const response = await repository.transferDeposit(2, 1, 100, trx);

    expect(response).toEqual({ buyersDeposit: 50, sellersDeposit: 150 });
  });

  it("should fail when The buyer's deposit is lower than the purchase subtotal", async () => {
    const trx = jest.fn() as unknown as Knex.Transaction;
    FakeDepositRepository.transferDeposit.mockRejectedValue(
      new ConflictException(
        "The buyer's deposit is lower than the purchase subtotal",
      ),
    );

    await expect(
      repository.transferDeposit(2, 1, 100, trx),
    ).rejects.toThrowError(
      new ConflictException(
        "The buyer's deposit is lower than the purchase subtotal",
      ),
    );
  });
});
