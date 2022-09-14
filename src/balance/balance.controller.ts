import { BalanceService } from "./balance.service";
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { ApiHeader, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AmountDto } from "./dto/amount.dto";
import { RoleGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import DepositDto from "./dto/deposit.dto";
import JwtDto from "src/auth/dto/jwt.dto";

@Controller("balance")
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  /* -------------------------------------------------------------------------- */
  /*                               Add to Deposit                               */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Balance")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The user has successfully added to his/her balance.",
    type: DepositDto,
  })
  @SetMetadata("role", "buyer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(200)
  @Post("deposit")
  async addBalance(
    @Body() payload: AmountDto,
    @Request() req: Request & { user: JwtDto },
  ) {
    const deposit = await this.balanceService.addBalance(
      req.user.id,
      payload.amount,
    );

    return {
      deposit,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                Reset Deposit                               */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Balance")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The user has been successfully reset his/her balance to 0.",
  })
  @SetMetadata("role", "buyer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(200)
  @Post("reset")
  async resetBalance(@Request() req: Request & { user: JwtDto }) {
    const balance = await this.balanceService.resetBalance(req.user.id);

    return {
      balance,
    };
  }
}
