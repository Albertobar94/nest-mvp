import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { ConflictException, Injectable } from "@nestjs/common";

type Deposit = { deposit: number };
@Injectable()
export class DepositRepository {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async getDeposit(userId: number, trx?: Knex.Transaction) {
    const query = trx
      ? this.knex.from<Deposit>("user").transacting(trx).forUpdate()
      : this.knex.from<Deposit>("user");

    const [result] = await query.select("deposit").where("id", userId);

    if (result && "deposit" in result) {
      return result;
    }

    throw new ConflictException(
      "Could not get deposit, please contact support",
    );
  }

  async addDeposit(userId: number, amount: number, trx?: Knex.Transaction) {
    const query = trx
      ? this.knex.from<Deposit>("user").transacting(trx)
      : this.knex.from<Deposit>("user");

    const [result] = await query
      .update({ deposit: this.knex.raw("deposit + ??", [amount]) })
      .where("id", userId)
      .returning("deposit");

    if (result && "deposit" in result) {
      return result;
    }

    throw new ConflictException(
      "Could not deposit amount, please contact support",
    );
  }

  async resetDeposit(userId: number, trx?: Knex.Transaction) {
    const query = trx
      ? this.knex.from<Deposit>("user").transacting(trx)
      : this.knex.from<Deposit>("user");

    const [result] = await query
      .update({ deposit: 0 })
      .where("id", userId)
      .returning("deposit");

    if (result && "deposit" in result) {
      return result;
    }

    throw new ConflictException(
      "Could not reset deposit, please contact support",
    );
  }

  async transferDeposit(
    buyerId: number,
    sellerId: number,
    amount: number,
    trx: Knex.Transaction,
  ) {
    const [{ deposit: buyerCurrDeposit }] = await this.knex
      .from<Deposit>("user")
      .transacting(trx)
      .select("deposit")
      .where("id", buyerId)
      .forUpdate();

    if (buyerCurrDeposit < amount) {
      throw new ConflictException(
        "The buyer's deposit is lower than the purchase subtotal",
      );
    }

    const [[{ deposit: buyersDeposit }], [{ deposit: sellersDeposit }]] =
      await Promise.all([
        this.knex
          .from<Deposit>("user")
          .transacting(trx)
          .update({ deposit: this.knex.raw("deposit - ??", [amount]) })
          .where("id", buyerId)
          .returning("deposit"),
        this.knex
          .from<Deposit>("user")
          .transacting(trx)
          .update({ deposit: this.knex.raw("deposit + ??", [amount]) })
          .where("id", sellerId)
          .returning("deposit"),
      ]);

    return { buyersDeposit, sellersDeposit };
  }
}

export default DepositRepository;
