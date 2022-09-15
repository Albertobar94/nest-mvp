import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { ProductEntity } from "./entities/product.entity";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(): Promise<Record<string, ProductEntity[]>> {
    const products = await this.productRepository.getAll();

    return {
      products,
    };
  }

  async getProduct(id: number) {
    const product = await this.productRepository.getProduct(id);

    return {
      product,
    };
  }

  async postProduct(
    sellerId: number,
    data: Omit<ProductEntity, "id" | "sellerId">,
  ) {
    const product = await this.productRepository.insertProduct(sellerId, data);

    return {
      product,
    };
  }

  async putProduct(
    sellerId: number,
    id: number,
    data: Partial<UpdateProductDto>,
  ) {
    const product = await this.productRepository.updateProduct(
      sellerId,
      id,
      data,
    );

    return {
      product,
    };
  }

  async deleteProduct(sellerId: number, id: number): Promise<number> {
    return this.productRepository.deleteProduct(sellerId, id);
  }
}
