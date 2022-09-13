import { ProductService } from "./product.service";
import { Test, TestingModule } from "@nestjs/testing";
import ProductRepository from "./product.repository";

describe("ProductService", () => {
  let service: ProductService;
  const FakeProductService: Partial<ProductService> = {};
  const FakeProductRepository: Partial<ProductRepository> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: ProductService, useValue: FakeProductService },
        { provide: ProductRepository, useValue: FakeProductRepository },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
