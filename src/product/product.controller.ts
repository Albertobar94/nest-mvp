import { RoleGuard } from "../auth/guards/roles.guard";
import { ParseIntPipe } from "./../pipes/parse-int.pipe";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Request,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiHeader,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from "@nestjs/swagger";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductService } from "./product.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { isResourceOwnerGuard } from "./guards/is-resource-owner.guard";
import UpdateProductDto from "./dto/update-prodcut.dto";
import JwtDto from "../auth/dto/jwt.dto";

/* -------------------------------------------------------------------------- */
/*                              Get All Products                              */
/* -------------------------------------------------------------------------- */

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiTags("Product")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The records has been successfully fetched.",
    type: [ProductEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProducts(): Promise<Record<string, unknown>> {
    const data = await this.productService.getProducts();

    return {
      ...data,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Product By Id                             */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Product")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The record has been successfully fetched.",
    type: [ProductEntity],
  })
  @UseGuards(JwtAuthGuard)
  @Get("/:id")
  async getProduct(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<Record<string, unknown>> {
    const data = await this.productService.getProduct(id);

    return {
      ...data,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                               Create Product                               */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Product")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiCreatedResponse({
    description: "The record has been successfully created.",
    type: [ProductEntity],
  })
  @SetMetadata("role", "seller")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(201)
  @Post()
  async postProduct(
    @Body() product: CreateProductDto,
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    const data = await this.productService.postProduct(req.user.id, product);

    return {
      ...data,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                               Update Product                               */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Product")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiOkResponse({
    description: "The record has been successfully updated.",
    type: [ProductEntity],
  })
  @SetMetadata("role", "seller")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put("/:id")
  async putProduct(
    @Body() product: UpdateProductDto,
    @Param("id", ParseIntPipe) id: number,
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    const data = await this.productService.putProduct(req.user.id, id, product);

    return {
      ...data,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                               Delete Product                               */
  /* -------------------------------------------------------------------------- */
  @ApiTags("Product")
  @ApiHeader({
    name: "Authorization",
    description: "Bearer user JWT token",
  })
  @ApiNoContentResponse({
    description: "The record has been successfully deleted.",
  })
  @HttpCode(204)
  @SetMetadata("role", "seller")
  @UseGuards(JwtAuthGuard, RoleGuard, isResourceOwnerGuard)
  @Delete("/:id")
  async deleteProduct(
    @Param("id", ParseIntPipe) id: number,
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    return this.productService.deleteProduct(req.user.id, id);
  }
}
