import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { Injectable } from "@nestjs/common";
import { DepositRepository } from "./deposit.repository";

@Injectable()
export class DepositService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly depositRepository: DepositRepository,
  ) {}

  async addDeposit(userId: number, amount: number) {
    return this.knex.transaction(async (trx) => {
      const { deposit } = await this.depositRepository.addDeposit(
        userId,
        amount,
        trx,
      );

      return { deposit };
    });
  }

  async resetDeposit(userId: number) {
    const { deposit } = await this.depositRepository.resetDeposit(userId);

    return { deposit };
  }
}
