import { RoleGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "./../auth/guards/jwt-auth.guard";
import { ParseIntPipe } from "./../pipes/parse-int.pipe";
import { PurchaseDto } from "./dto/purchase.dto";
import { PurchaseService } from "./purchase.service";
import { ApiCreatedResponse, ApiHeader, ApiTags } from "@nestjs/swagger";
import {
  Controller,
  HttpCode,
  Post,
  Query,
  Request,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import JwtDto from "../auth/dto/jwt.dto";

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
  @HttpCode(201)
  @Post()
  async purchase(
    @Query("productId", ParseIntPipe) productId: PurchaseDto["productId"],
    @Query("quantity", ParseIntPipe) quantity: PurchaseDto["quantity"],
    @Request() req: Request & { user: JwtDto },
  ) {
    return this.purchaseService.executePurchase(
      req.user.id,
      productId,
      quantity,
    );
  }
}
