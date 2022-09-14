import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Request,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { ApiHeader, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AmountDto } from "./dto/amount.dto";
import { JwtDto } from "../auth/dto/jwt.dto";
import { DepositDto } from "./dto/deposit.dto";
import { DepositService } from "./deposit.service";
import { RoleGuard } from "../auth/guards/roles.guard";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("deposit")
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  /* -------------------------------------------------------------------------- */
  /*                               Add to Deposit                               */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Deposit")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The user has successfully added to his/her deposit.",
    type: DepositDto,
  })
  @SetMetadata("role", "buyer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(200)
  @Post()
  async addDeposit(
    @Body() payload: AmountDto,
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    const { deposit } = await this.depositService.addDeposit(
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
  @ApiTags("Deposit")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The user has been successfully reset his/her deposit to 0.",
  })
  @SetMetadata("role", "buyer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(200)
  @Put("reset")
  async resetDeposit(
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    const { deposit } = await this.depositService.resetDeposit(req.user.id);

    return {
      deposit,
    };
  }
}
