import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "./product.controller";
import ProductRepository from "./product.repository";
import { ProductService } from "./product.service";

describe("ProductController", () => {
  let controller: ProductController;
  const FakeProductService: Partial<ProductService> = {};
  const FakeProductRepository: Partial<ProductRepository> = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        { provide: ProductService, useValue: FakeProductService },
        { provide: ProductRepository, useValue: FakeProductRepository },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
