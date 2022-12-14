import { ApiCreatedResponse, ApiHeader, ApiTags } from "@nestjs/swagger";
import {
  Controller,
  Post,
  Query,
  Request,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { JwtDto } from "../auth/dto/jwt-payload.dto";
import { PurchaseDto } from "./dto/purchase-request.dto";
import { PurchaseService } from "./purchase.service";
import { RoleGuard } from "../auth/guards/roles.guard";
import { ParseIntPipe } from "./../pipes/parse-int.pipe";
import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";

@Controller("buy")
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  /* -------------------------------------------------------------------------- */
  /*                               Create Purchase                              */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Purchase")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiCreatedResponse({
    description: "The purchase has been successfully created.",
    type: PurchaseDto,
  })
  @SetMetadata("role", "buyer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  async purchase(
    @Query("productId", ParseIntPipe) productId: PurchaseDto["productId"],
    @Query("quantity", ParseIntPipe) quantity: PurchaseDto["quantity"],
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    const { purchase } = await this.purchaseService.executePurchase(
      req.user.id,
      productId,
      quantity,
    );

    return { purchase };
  }
}
