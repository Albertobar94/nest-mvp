import { PurchaseService } from "./purchase.service";
import { Test, TestingModule } from "@nestjs/testing";
import PurchaseRepository from "./purchase.repository";
import { ConflictException, NotFoundException } from "@nestjs/common";

describe("PurchaseService", () => {
  let service: PurchaseService;
  const FakePurchaseService = {
    executePurchase: jest.fn(),
  };
  const FakePurchaseRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: PurchaseService, useValue: FakePurchaseService },
        { provide: PurchaseRepository, useValue: FakePurchaseRepository },
      ],
    }).compile();

    service = module.get<PurchaseService>(PurchaseService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should be execute purchase", async () => {
    FakePurchaseService.executePurchase.mockResolvedValue({
      purchase: {
        sellerId: 1,
        productId: 1,
        productName: "Milk",
        quantity: 1,
        purchaseTotal: 20,
        change: [100, 20, 10],
      },
    });
    const response = await service.executePurchase(1, 2, 1);

    expect(FakePurchaseService.executePurchase).toBeCalledWith(1, 2, 1);
    expect(response).toEqual({
      purchase: {
        sellerId: 1,
        productId: 1,
        productName: "Milk",
        quantity: 1,
        purchaseTotal: 20,
        change: [100, 20, 10],
      },
    });
  });

  it("should fail when The product doesn't exist", async () => {
    FakePurchaseService.executePurchase.mockRejectedValue(
      new NotFoundException("The product doesn't exist"),
    );

    await expect(service.executePurchase(1, 2, 1)).rejects.toThrowError(
      new NotFoundException("The product doesn't exist"),
    );
  });

  it("should fail when The inventory is lower than the requested quantity", async () => {
    FakePurchaseService.executePurchase.mockRejectedValue(
      new ConflictException(
        "The inventory is lower than the requested quantity",
      ),
    );

    await expect(service.executePurchase(1, 2, 1)).rejects.toThrowError(
      new ConflictException(
        "The inventory is lower than the requested quantity",
      ),
    );
  });
});
