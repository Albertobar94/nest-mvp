/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.raw(`
        create or replace function is_seller(int) returns boolean as $$ 
        SELECT EXISTS (
            SELECT 1
            FROM "user"
            WHERE (id = $1 OR id IS NULL)
            AND (role = 'seller' OR role IS NULL)
        );
        $$ language sql;
    `);
  await knex.schema.raw(`
        create or replace function is_buyer(int) returns boolean as $$ 
        SELECT EXISTS (
            SELECT 1
            FROM "user"
            WHERE id = $1
            AND role = 'buyer'
        );
        $$ language sql;
    `);
  await knex.schema.raw(`
        ALTER TABLE "product" ADD CONSTRAINT chk_is_seller CHECK (is_seller(seller_id));
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.raw(`DROP TABLE IF EXISTS "product"`);
  await knex.schema.raw(`DROP FUNCTION IF EXISTS is_seller`);
  await knex.schema.raw(`DROP FUNCTION IF EXISTS is_buyer`);
};
