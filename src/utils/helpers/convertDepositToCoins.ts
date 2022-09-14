import { ALLOWED_COINS } from "../../deposit/constants/allowed-coins.constant";

export function depositToCoins(
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
    return [coins[0]].concat(depositToCoins(left, coins));
  } else {
    coins.shift();
    return depositToCoins(amount, coins);
  }
}
