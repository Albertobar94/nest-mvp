import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductRepository } from "./product.repository";
import { ProductController } from "./product.controller";

@Module({
  exports: [ProductRepository],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
