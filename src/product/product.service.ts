import { Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductRepository } from "./product.repository";

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(): Promise<Record<string, ProductEntity[]>> {
    const products = await this.productRepository.getAll();

    return {
      products,
    };
  }

  async getProduct(id: number): Promise<Record<string, ProductEntity[]>> {
    const product = await this.productRepository.getProduct(id);

    return {
      product,
    };
  }

  async postProduct(
    data: Omit<ProductEntity, "id">,
  ): Promise<Record<string, ProductEntity[]>> {
    const product = await this.productRepository.insertProduct(data);

    return {
      product,
    };
  }

  async putProduct(
    id: number,
    data: Partial<CreateProductDto>,
  ): Promise<Record<string, ProductEntity[]>> {
    const product = await this.productRepository.updateProduct(id, data);

    return {
      product,
    };
  }

  async deleteProduct(id: number): Promise<number> {
    return this.productRepository.deleteProduct(id);
  }
}
