import { Test, TestingModule } from "@nestjs/testing";
import { PurchaseController } from "./purchase.controller";
import { PurchaseRepository } from "./purchase.repository";
import { PurchaseService } from "./purchase.service";

describe("PurchaseController", () => {
  let controller: PurchaseController;
  const FakePurchaseService: Partial<PurchaseService> = {};
  const FakePurchaseRepository: Partial<PurchaseRepository> = {};

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
});
