import { ALLOWED_COINS } from "../../constants/allowed-coins.constant";

export function balanceToCoins(
  amount: number,
  coins: number[] = ALLOWED_COINS,
): number[] {
  if (typeof amount !== "number") {
    return [];
  }

  if (amount <= 0) {
    return [];
  }

  if (amount >= coins[0]) {
    const left = amount - coins[0];
    return [coins[0]].concat(balanceToCoins(left, coins));
  } else {
    coins.shift();
    return balanceToCoins(amount, coins);
  }
}
