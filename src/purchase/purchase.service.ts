import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PurchaseDto } from "./dto/purchase.dto";
import { PurchaseRepository } from "./purchase.repository";
import { ProductRepository } from "../product/product.repository";
import { BalanceRepository } from "../balance/balance.repository";
import { balanceToCoins } from "../utils/helpers/convertBalanceToCoins";

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly productRepository: ProductRepository,
    private readonly balanceRepository: BalanceRepository,
  ) {}

  async executePurchase(
    buyerId: PurchaseDto["buyerId"],
    productId: PurchaseDto["productId"],
    purchaseQuantity: PurchaseDto["quantity"],
  ) {
    return this.knex.transaction(async (trx) => {
      // Lock the Product
      const [product] = await this.productRepository.getProduct(productId, trx);
      if (!product) {
        throw new NotFoundException("The product doesn't exist");
      }

      const purchaseSubTotal = Math.round(purchaseQuantity * product.cost);

      if (product.amountAvailable < purchaseQuantity) {
        throw new ConflictException(
          "The inventory is lower than the requested quantity",
        );
      }

      // Lock buyer's balance
      const buyersBalance = await this.balanceRepository.getBalance(
        buyerId,
        trx,
      );

      if (buyersBalance < purchaseSubTotal) {
        throw new ConflictException(
          "The buyer's balance is lower than the purchase sub total",
        );
      }

      const [purchase] = await this.purchaseRepository.insertPurchase(
        {
          buyerId,
          sellerId: product.sellerId,
          itemCost: product.cost,
          itemId: product.id,
          itemName: product.name,
          itemsTotal: purchaseQuantity,
          total: purchaseSubTotal,
        },
        trx,
      );

      await this.productRepository.subtractInventory(
        productId,
        purchaseQuantity,
        trx,
      );

      const { buyersBalance: buyersFinalBalance } =
        await this.balanceRepository.transferBalance(
          buyerId,
          product.sellerId,
          purchaseSubTotal,
          trx,
        );

      return {
        productId: purchase.itemId,
        productName: purchase.itemName,
        total: purchase.total,
        change: balanceToCoins(buyersFinalBalance),
      };
    });
  }
}
