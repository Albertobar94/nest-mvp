/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("user").del();
  await knex("user").insert([
    {
      id: 1,
      username: "alberto",
      password: "GAG39jagdgnadg.g4iqg4",
      deposit: 0,
      role: "buyer",
    },
    {
      id: 2,
      username: "roberto",
      password: "GAG39jagdgnadg.g4iqg4",
      deposit: 0,
      role: "buyer",
    },
    {
      id: 3,
      username: "adolfo",
      password: "GAG39jagdgnadg.g4iqg4",
      deposit: 0,
      role: "seller",
    },
  ]);
};
