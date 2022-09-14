import {
  postProductDto,
  products,
  putProductDto,
} from "./mocks/products.mocks";
import { ProductService } from "./product.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ProductRepository } from "./product.repository";

describe("ProductService", () => {
  let service: ProductService;
  const FakeProductService = {
    getProducts: jest.fn().mockResolvedValue({
      products,
    }),
    getProduct: jest.fn().mockResolvedValue({
      product: [products[0]],
    }),
    postProduct: jest.fn().mockResolvedValue({
      product: [products[1]],
    }),
    putProduct: jest.fn().mockResolvedValue({
      product: [products[2]],
    }),
    deleteProduct: jest.fn().mockResolvedValue(undefined),
  };
  const FakeProductRepository = {};

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

  it("should get all products", async () => {
    const response = await service.getProducts();

    expect(FakeProductService.getProducts).toHaveBeenCalledWith();
    expect(FakeProductService.getProducts).toHaveBeenCalledTimes(1);
    expect(response.products.length).toEqual(3);
    expect(response.products).toEqual(products);
  });

  it("should get product by id", async () => {
    const response = await service.getProduct(1);

    expect(FakeProductService.getProduct).toHaveBeenCalledWith(1);
    expect(FakeProductService.getProduct).toHaveBeenCalledTimes(1);
    expect((response.product as Array<Record<string, any>>).length).toEqual(1);
    expect(response.product).toEqual([products[0]]);
  });

  it("should create a sproduct", async () => {
    const response = await service.postProduct(1, postProductDto);

    expect(FakeProductService.postProduct).toHaveBeenCalledWith(
      1,
      postProductDto,
    );
    expect(response.product.length).toEqual(1);
    expect(response.product).toEqual([products[1]]);
  });

  it("should update product", async () => {
    const response = await service.putProduct(1, 3, putProductDto);

    expect(FakeProductService.putProduct).toHaveBeenCalledWith(
      1,
      3,
      putProductDto,
    );
    expect(response.product.length).toEqual(1);
    expect(response.product).toEqual([products[2]]);
  });

  it("should delete a product", async () => {
    const response = await service.deleteProduct(1, 1);

    expect(FakeProductService.deleteProduct).toHaveBeenCalledWith(1, 1);
    expect(response).toEqual(undefined);
  });
});
