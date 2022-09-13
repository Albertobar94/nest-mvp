import { Knex } from "knex";
import { CreateProductDto } from "./dto/create-product.dto";
import { InjectModel } from "nest-knexjs";
import { Injectable } from "@nestjs/common";
import { ProductEntity } from "./entities/product.entity";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ProductRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getAll() {
    const products = await this.knex.from("product").select();
    return products.map((product) => {
      return plainToInstance(ProductEntity, product, {
        excludeExtraneousValues: true,
      });
    });
  }

  async getProduct(id: number, trx?: Knex.Transaction) {
    const query = trx
      ? this.knex.from("product").transacting(trx).forUpdate()
      : this.knex.from("product");

    const product = await query.select().where("id", id).returning("*");
    return product.map((product) => {
      return plainToInstance(ProductEntity, product, {
        excludeExtraneousValues: true,
      });
    });
  }

  async insertProduct(data: CreateProductDto) {
    const product = await this.knex
      .from<ProductEntity>("product")
      .insert({ ...data }, "*");

    return product.map((product) => {
      return plainToInstance(ProductEntity, product, {
        excludeExtraneousValues: true,
      });
    });
  }

  async updateProduct(
    id: ProductEntity["id"],
    data: Partial<CreateProductDto>,
  ) {
    const product = await this.knex
      .from<ProductEntity>("product")
      .update({ ...data }, "*")
      .where("id", id);

    return product.map((product) => {
      return plainToInstance(ProductEntity, product, {
        excludeExtraneousValues: true,
      });
    });
  }

  async subtractInventory(
    id: ProductEntity["id"],
    amount: ProductEntity["amountAvailable"],
    trx?: Knex.Transaction,
  ) {
    const query = trx
      ? this.knex.from<ProductEntity>("product").transacting(trx).forUpdate()
      : this.knex.from<ProductEntity>("product");

    const product = await query
      .update(
        {
          amountAvailable: this.knex.raw("amount_available - ??", [amount]),
        },
        "*",
      )
      .where("id", id);

    return product.map((product) => {
      return plainToInstance(ProductEntity, product, {
        excludeExtraneousValues: true,
      });
    });
  }

  async deleteProduct(id: number) {
    return this.knex.from<ProductEntity>("product").delete().where("id", id);
  }
}

export default ProductRepository;
