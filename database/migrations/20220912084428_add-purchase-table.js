/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("purchase", (table) => {
    table.bigIncrements("id").primary().notNullable();
    table
      .integer("total")
      .checkBetween([0, Number.MAX_SAFE_INTEGER])
      .notNullable();

    // Product
    table.text("item_name").notNullable();
    table.integer("item_id").references("product.id").onDelete("SET NULL");

    table
      .integer("item_cost")
      .defaultTo(0)
      .checkBetween([0, Number.MAX_SAFE_INTEGER])
      .notNullable();
    table
      .integer("items_total")
      .defaultTo(0)
      .checkBetween([0, Number.MAX_SAFE_INTEGER])
      .notNullable();

    // User
    table.integer("buyer_id").references("user.id").onDelete("SET NULL");
    table.integer("seller_id").references("user.id").onDelete("SET NULL");
  });

  await knex.schema.raw(`
        ALTER TABLE "purchase" ADD CONSTRAINT chk_is_buyer CHECK ((is_buyer(buyer_id)) or (buyer_id is null));
    `);
  await knex.schema.raw(`
        ALTER TABLE "purchase" ADD CONSTRAINT chk_is_seller CHECK ((is_seller(seller_id)) or (seller_id is null)); 
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTable("purchase");
};
