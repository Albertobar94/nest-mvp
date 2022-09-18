import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ProductEntity } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product-request.dto";

@Injectable()
export class ProductRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getAll() {
    // When products go over x amount of items pagination must be introduced
    const products = await this.knex.from("product").select();
    return products.map((product) => {
      return plainToInstance(ProductEntity, product);
    });
  }

  async getProduct(id: number, trx?: Knex.Transaction) {
    const query = trx
      ? this.knex.from("product").transacting(trx).forUpdate()
      : this.knex.from("product");

    const product = await query.select().where("id", id).returning("*");
    return product.map((product) => {
      return plainToInstance(ProductEntity, product);
    });
  }

  async insertProduct(sellerId: number, data: CreateProductDto) {
    const product = await this.knex
      .from<ProductEntity>("product")
      .insert({ ...data, sellerId }, "*");

    return product.map((product) => {
      return plainToInstance(ProductEntity, product);
    });
  }

  async updateProduct(
    sellerId: number,
    id: ProductEntity["id"],
    data: Partial<CreateProductDto>,
  ) {
    const product = await this.knex
      .from<ProductEntity>("product")
      .update({ ...data }, "*")
      .where({ id, sellerId });

    return product.map((product) => {
      return plainToInstance(ProductEntity, product);
    });
  }

  async subtractInventory(
    id: ProductEntity["id"],
    amount: ProductEntity["amountAvailable"],
    trx?: Knex.Transaction,
  ) {
    const query = trx
      ? this.knex.from<ProductEntity>("product").transacting(trx)
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
      return plainToInstance(ProductEntity, product);
    });
  }

  async deleteProduct(sellerId: number, id: number) {
    return this.knex
      .from<ProductEntity>("product")
      .delete()
      .where({ id, sellerId });
  }
}

export default ProductRepository;
