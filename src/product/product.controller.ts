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
import { ProductDto } from "./dto/product.dto";
import { ProductEntity } from "./entities/product.entity";
import { ProductService } from "./product.service";
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
  async postProduct(@Body() product: ProductDto, @Request() req: any) {
    const data = await this.productService.postProduct({
      ...product,
      sellerId: req.user.id,
    });

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
  @UseGuards(JwtAuthGuard, RoleGuard, isResourceOwnerGuard)
  @Put("/:id")
  async putProduct(
    @Body() product: Partial<ProductDto>,
    @Param("id", ParseIntPipe) id: number,
  ) {
    const data = await this.productService.putProduct(id, product);

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
  async deleteProduct(@Param("id", ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
