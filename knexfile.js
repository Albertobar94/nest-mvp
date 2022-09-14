/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { config } = require("dotenv");
const { ConfigService } = require("@nestjs/config");
const BASE_PATH = path.join(__dirname, "database");

config({
  path: `.env.${process.env.NODE_ENV?.toLocaleLowerCase() ?? "development"}`,
});
const configService = new ConfigService();

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

module.exports = {
  development: knexConfig,
  test: knexConfig,
  staging: knexConfig,
  production: knexConfig,
};
