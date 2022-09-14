import { Test, TestingModule } from "@nestjs/testing";
import { PurchaseService } from "./purchase.service";
import { PurchaseController } from "./purchase.controller";
import { PurchaseRepository } from "./purchase.repository";

describe("PurchaseController", () => {
  let controller: PurchaseController;
  const FakePurchaseService = {
    executePurchase: jest.fn(),
  };
  const FakePurchaseRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseController],
      providers: [
        { provide: PurchaseService, useValue: FakePurchaseService },
        { provide: PurchaseRepository, useValue: FakePurchaseRepository },
      ],
    }).compile();

    controller = module.get<PurchaseController>(PurchaseController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
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
    const response = await controller.purchase(2, 1, { user: { id: 1 } });

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
});
