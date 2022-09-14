import * as Joi from "joi";
import { Module } from "@nestjs/common";
import { KnexModule } from "nest-knexjs";
import * as knexStringcase from "knex-stringcase";
import { ThrottlerModule } from "@nestjs/throttler";
import { RedisModule } from "@liaoliaots/nestjs-redis";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import { UserRepository } from "./user/user.repository";
import { ProductModule } from "./product/product.module";
import { BalanceModule } from "./balance/balance.module";
import { BalanceService } from "./balance/balance.service";
import { PurchaseModule } from "./purchase/purchase.module";
import { PurchaseService } from "./purchase/purchase.service";
import { BalanceController } from "./balance/balance.controller";
import { BalanceRepository } from "./balance/balance.repository";
import { PurchaseRepository } from "./purchase/purchase.repository";
import { PurchaseController } from "./purchase/purchase.controller";

const ENVIRONMENT = process.env.NODE_ENV?.toLocaleLowerCase() || "development";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const knexFile = require("../knexfile.js");

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${ENVIRONMENT}`,
      validationSchema: Joi.object({
        ENVIRONMENT: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PWD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        BCRYPT_ROUNDS: Joi.number().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_DB: Joi.number().required(),
        // REDIS_PASSWORD: Joi.string(),
        REDIS_PREFIX: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    KnexModule.forRoot({
      config: knexStringcase(knexFile[ENVIRONMENT]),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => {
        return {
          config: {
            host: configService.get("REDIS_HOST"),
            port: configService.get("REDIS_PORT"),
            db: configService.get("REDIS_DB"),
            keyPrefix: configService.get("REDIS_PREFIX"),
          },
          closeClient: true,
        };
      },
      inject: [ConfigService],
    }),
    ProductModule,
    UserModule,
    BalanceModule,
    AuthModule,
    PurchaseModule,
  ],
  controllers: [UserController, BalanceController, PurchaseController],
  providers: [
    UserService,
    BalanceService,
    PurchaseService,
    UserRepository,
    BalanceRepository,
    PurchaseRepository,
  ],
})
export class AppModule {}
