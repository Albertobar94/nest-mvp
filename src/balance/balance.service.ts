import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { Injectable } from "@nestjs/common";
import { BalanceRepository } from "./balance.repository";

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly balanceRepository: BalanceRepository,
  ) {}

  async addBalance(userId: number, amount: number) {
    return this.knex.transaction(async (trx) => {
      const balance = await this.balanceRepository.addBalance(
        userId,
        amount,
        trx,
      );

      return balance;
    });
  }

  async subtractBalance(userId: number, amount: number) {
    return this.knex.transaction(async (trx) => {
      const balance = await this.balanceRepository.subtractBalance(
        userId,
        amount,
        trx,
      );

      return balance;
    });
  }

  async getBalance(userId: number) {
    const balance = await this.balanceRepository.getBalance(userId);

    return balance;
  }

  async resetBalance(userId: number) {
    return this.balanceRepository.resetBalance(userId);
  }

  async transferBalance(
    senderUserId: number,
    receiverUserId: number,
    amount: number,
    trx?: Knex.Transaction,
  ) {
    if (trx) {
      return this.balanceRepository.transferBalance(
        senderUserId,
        receiverUserId,
        amount,
        trx,
      );
    }

    return this.knex.transaction(async (trx) => {
      return this.balanceRepository.transferBalance(
        senderUserId,
        receiverUserId,
        amount,
        trx,
      );
    });
  }
}
