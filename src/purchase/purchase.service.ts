import { Knex } from "knex";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "nest-knexjs";
import { PurchaseDto } from "./dto/purchase-request.dto";
import { PurchaseRepository } from "./purchase.repository";
import { ProductRepository } from "../product/product.repository";
import { DepositRepository } from "../deposit/deposit.repository";
import { depositToCoins } from "../utils/helpers/convertDepositToCoins";

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel() private readonly knex: Knex,
    private readonly purchaseRepository: PurchaseRepository,
    private readonly productRepository: ProductRepository,
    private readonly depositRepository: DepositRepository,
  ) {}

  async executePurchase(
    buyerId: number,
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

      // Lock buyer's deposit
      const { deposit: buyersDeposit } =
        await this.depositRepository.getDeposit(buyerId, trx);

      if (buyersDeposit < purchaseSubTotal) {
        throw new ConflictException(
          "The buyer's deposit is lower than the purchase sub total",
        );
      }

      const [record] = await this.purchaseRepository.insertPurchase(
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

      const { buyersDeposit: buyersFinalDeposit } =
        await this.depositRepository.transferDeposit(
          buyerId,
          product.sellerId,
          purchaseSubTotal,
          trx,
        );

      const purchase = {
        sellerId: record.sellerId,
        productId: record.itemId,
        productName: record.itemName,
        quantity: record.itemsTotal,
        purchaseTotal: record.total,
        change: depositToCoins(buyersFinalDeposit),
      };

      return { purchase };
    });
  }
}
