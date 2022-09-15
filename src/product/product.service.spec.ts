import {
  postProductDto,
  products,
  putProductDto,
} from "./mocks/products.mocks";
import { ProductService } from "./product.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ProductRepository } from "./product.repository";

const milkProduct = [products[0]];
const cheeseProduct = [products[1]];
const breadProduct = [products[2]];

describe("ProductService", () => {
  let service: ProductService;
  const FakeProductService = {
    getProducts: jest.fn().mockResolvedValue({
      products,
    }),
    getProduct: jest.fn().mockResolvedValue({
      product: milkProduct,
    }),
    postProduct: jest.fn().mockResolvedValue({
      product: cheeseProduct,
    }),
    putProduct: jest.fn().mockResolvedValue({
      product: breadProduct,
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
    const milkProductId = 1;
    const response = await service.getProduct(milkProductId);

    expect(FakeProductService.getProduct).toHaveBeenCalledWith(milkProductId);
    expect(FakeProductService.getProduct).toHaveBeenCalledTimes(1);
    expect(response.product.length).toEqual(1);
    expect(response.product).toEqual(milkProduct);
  });

  it("should create a sproduct", async () => {
    const sellerId = 1;
    const response = await service.postProduct(sellerId, postProductDto);

    expect(FakeProductService.postProduct).toHaveBeenCalledWith(
      sellerId,
      postProductDto,
    );
    expect(response.product.length).toEqual(1);
    expect(response.product).toEqual(cheeseProduct);
  });

  it("should update product", async () => {
    const sellerId = 1;
    const breadProductId = 3;
    const response = await service.putProduct(
      sellerId,
      breadProductId,
      putProductDto,
    );

    expect(FakeProductService.putProduct).toHaveBeenCalledWith(
      sellerId,
      breadProductId,
      putProductDto,
    );
    expect(response.product.length).toEqual(1);
    expect(response.product).toEqual(breadProduct);
  });

  it("should delete a product", async () => {
    const sellerId = 1;
    const milkProductId = 3;
    const response = await service.deleteProduct(sellerId, milkProductId);

    expect(FakeProductService.deleteProduct).toHaveBeenCalledWith(
      sellerId,
      milkProductId,
    );
    expect(response).toEqual(undefined);
  });
});
