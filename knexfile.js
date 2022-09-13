/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { config } = require("dotenv");
const BASE_PATH = path.join(__dirname, "database");
const { ConfigService } = require("@nestjs/config");

config({
  path: `.env.${process.env.NODE_ENV?.toLocaleLowerCase() || "development"}`,
});
const configService = new ConfigService();

/**
 * @type { import("knex").Knex.Config }
 */
const knexConfig = {
  client: "postgresql",
  connection: {
    host: configService.get("DB_HOST"),
    port: configService.get("DB_PORT"),
    user: configService.get("DB_USER"),
    password: configService.get("DB_PWD"),
    database: configService.get("DB_NAME"),
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.join(BASE_PATH, "migrations"),
  },
  seeds: {
    directory: path.join(BASE_PATH, "seeds"),
  },
};

/**
 * @type { Record<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: knexConfig,
  test: knexConfig,
  staging: knexConfig,
  production: knexConfig,
};
