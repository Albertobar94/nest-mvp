import { Test, TestingModule } from "@nestjs/testing";
import {
  jwtDto,
  postProductDto,
  products,
  putProductDto,
} from "./mocks/products.mocks";
import { ProductController } from "./product.controller";
import { ProductRepository } from "./product.repository";
import { ProductService } from "./product.service";

describe("ProductController", () => {
  let controller: ProductController;
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

  it("should get all products", async () => {
    const response = await controller.getProducts();

    expect(FakeProductService.getProducts).toHaveBeenCalledWith();
    expect(FakeProductService.getProducts).toHaveBeenCalledTimes(1);
    expect((response.products as Record<string, unknown>[]).length).toEqual(3);
    expect(response.products).toEqual(products);
  });

  it("should get product by id", async () => {
    const response = await controller.getProduct(1);

    expect(FakeProductService.getProduct).toHaveBeenCalledWith(1);
    expect(FakeProductService.getProduct).toHaveBeenCalledTimes(1);
    expect((response.product as Array<Record<string, any>>).length).toEqual(1);
    expect(response.product).toEqual([products[0]]);
  });

  it("should create a sproduct", async () => {
    const response = await controller.postProduct(postProductDto, jwtDto);

    expect(FakeProductService.postProduct).toHaveBeenCalledWith(
      1,
      postProductDto,
    );
    expect(response.product.length).toEqual(1);
    expect(response.product).toEqual([products[1]]);
  });

  it("should update product", async () => {
    const response = await controller.putProduct(putProductDto, 3, jwtDto);

    expect(FakeProductService.putProduct).toHaveBeenCalledWith(
      1,
      3,
      putProductDto,
    );
    expect(response.product.length).toEqual(1);
    expect(response.product).toEqual([products[2]]);
  });

  it("should delete a product", async () => {
    const response = await controller.deleteProduct(1, jwtDto);

    expect(FakeProductService.deleteProduct).toHaveBeenCalledWith(1, 1);
    expect(response).toEqual(undefined);
  });
});
