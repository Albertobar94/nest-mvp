import { Injectable } from "@nestjs/common";
import UpdateProductDto from "./dto/update-prodcut.dto";
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
    sellerId: number,
    data: Omit<ProductEntity, "id" | "sellerId">,
  ): Promise<Record<string, ProductEntity[]>> {
    const product = await this.productRepository.insertProduct(sellerId, data);

    return {
      product,
    };
  }

  async putProduct(
    sellerId: number,
    id: number,
    data: Partial<UpdateProductDto>,
  ): Promise<Record<string, ProductEntity[]>> {
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
