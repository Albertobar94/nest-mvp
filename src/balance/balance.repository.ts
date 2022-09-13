import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class BalanceRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getBalance(userId: number, trx?: Knex.Transaction): Promise<number> {
    const query = trx
      ? this.knex.from("user").transacting(trx).forUpdate()
      : this.knex.from("user");

    const [{ deposit }] = await query.select("deposit").where("id", userId);

    return deposit;
  }

  async resetBalance(userId: number, trx?: Knex.Transaction): Promise<number> {
    const query = trx
      ? this.knex.from("user").transacting(trx)
      : this.knex.from("user");

    const [{ deposit }] = await query
      .update({ deposit: 0 })
      .where("id", userId)
      .returning("deposit");

    return deposit;
  }

  async addBalance(
    userId: number,
    amount: number,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = trx
      ? this.knex.from("user").transacting(trx)
      : this.knex.from("user");

    const [{ deposit }] = await query
      .update({ deposit: this.knex.raw("deposit + ??", [amount]) })
      .where("id", userId)
      .returning("deposit");

    return deposit;
  }

  async subtractBalance(
    userId: number,
    amount: number,
    trx?: Knex.Transaction,
  ): Promise<number> {
    const query = trx
      ? this.knex.from("user").transacting(trx)
      : this.knex.from("user");

    const [{ deposit }] = await query
      .update({ deposit: this.knex.raw("deposit - ??", [amount]) })
      .where("id", userId)
      .returning("deposit");

    return deposit;
  }

  async transferBalance(
    buyerId: number,
    sellerId: number,
    amount: number,
    trx: Knex.Transaction,
  ) {
    const [{ deposit: buyerCurrBalance }] = await this.knex
      .from("user")
      .transacting(trx)
      .select("deposit")
      .where("id", buyerId)
      .forUpdate();

    if (buyerCurrBalance < amount) {
      throw new ConflictException(
        "The buyer's balance is lower than the purchase subtotal",
      );
    }

    const [[{ deposit: buyersBalance }], [{ deposit: sellersBalance }]] =
      await Promise.all([
        this.knex
          .from<{ deposit: number }>("user")
          .transacting(trx)
          .update({ deposit: this.knex.raw("deposit - ??", [amount]) })
          .where("id", buyerId)
          .returning("deposit"),
        this.knex
          .from<{ deposit: number }>("user")
          .transacting(trx)
          .update({ deposit: this.knex.raw("deposit + ??", [amount]) })
          .where("id", sellerId)
          .returning("deposit"),
      ]);

    return { buyersBalance, sellersBalance };
  }
}

export default BalanceRepository;
