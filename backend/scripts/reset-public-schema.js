require("dotenv").config();

const { Client } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  // WARNING: This nukes all tables, enums, views, etc. in public schema.
  await client.query('DROP SCHEMA IF EXISTS "public" CASCADE;');
  await client.query('CREATE SCHEMA "public";');

  console.log("Reset public schema (dropped + recreated)");

  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
