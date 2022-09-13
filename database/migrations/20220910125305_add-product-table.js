/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("product", (table) => {
    table.bigIncrements("id").primary().notNullable();
    table.text("name").notNullable();
    table
      .integer("cost")
      .defaultTo(0)
      .checkBetween([0, Number.MAX_SAFE_INTEGER])
      .notNullable();
    table
      .integer("amount_available")
      .defaultTo(0)
      .checkBetween([0, Number.MAX_SAFE_INTEGER])
      .notNullable();
    table
      .integer("seller_id")
      .references("user.id")
      .onDelete("CASCADE")
      .notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.raw(`
        DROP TABLE IF EXISTS "product" 
    `);
};
