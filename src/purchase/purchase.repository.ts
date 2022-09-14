import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { PurchaseEntity } from "./entities/purchase.entity";

@Injectable()
export class PurchaseRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async insertPurchase(
    data: Omit<PurchaseEntity, "id">,
    trx: Knex.Transaction,
  ) {
    const purchase = await this.knex
      .from<PurchaseEntity>("purchase")
      .insert({ ...data })
      .transacting(trx)
      .returning("*");

    return purchase.map((purchase) => {
      return plainToInstance(PurchaseEntity, purchase);
    });
  }
}

export default PurchaseRepository;
