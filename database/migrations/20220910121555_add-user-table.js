/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("user", (table) => {
    table.increments("id").primary().notNullable();

    // auth
    table.string("username", 256).unique().notNullable();
    table.text("password").notNullable();

    // Roles
    table.enum("role", ["seller", "buyer"]).notNullable();

    // Balance
    table
      .integer("deposit")
      .defaultTo(0)
      .checkBetween([0, Number.MAX_SAFE_INTEGER])
      .notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("user");
};
