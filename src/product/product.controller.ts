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
import { JwtDto } from "../auth/dto/jwt.dto";
import { ProductService } from "./product.service";
import { RoleGuard } from "../auth/guards/roles.guard";
import { ParseIntPipe } from "./../pipes/parse-int.pipe";
import { ProductEntity } from "./entities/product.entity";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { isResourceOwnerGuard } from "./guards/is-resource-owner.guard";

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
  async getProducts() {
    const { products } = await this.productService.getProducts();

    return {
      products,
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
  async getProduct(@Param("id", ParseIntPipe) id: number) {
    const { product } = await this.productService.getProduct(id);

    return {
      product,
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
    @Body() data: CreateProductDto,
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    const { product } = await this.productService.postProduct(
      req.user.id,
      data,
    );

    return {
      product,
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
    @Body() data: UpdateProductDto,
    @Param("id", ParseIntPipe) id: number,
    @Request()
    req: Partial<Request> & { user: Omit<JwtDto, "role" | "username"> },
  ) {
    const { product } = await this.productService.putProduct(
      req.user.id,
      id,
      data,
    );

    return {
      product,
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
    await this.productService.deleteProduct(req.user.id, id);

    return;
  }
}
