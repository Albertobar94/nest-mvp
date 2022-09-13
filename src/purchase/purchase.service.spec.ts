import { PurchaseService } from "./purchase.service";
import { Test, TestingModule } from "@nestjs/testing";
import PurchaseRepository from "./purchase.repository";

describe("PurchaseService", () => {
  let service: PurchaseService;
  const FakePurchaseService: Partial<PurchaseService> = {};
  const FakePurchaseRepository: Partial<PurchaseRepository> = {};

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
});
