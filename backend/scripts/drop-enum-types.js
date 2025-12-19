require("dotenv").config();

const { Client } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

const TYPES = [
  "condition_status",
  "unit_status",
  "billing_cycle",
  "leases_status",
  "invoice_type",
  "invoice_status",
  "payment_method",
  "maintenance_priority",
  "maintenance_status",
  "maintenance_type",
  "notification_channel",
  "notification_status",
  "org_role",
  "user_system_role",
];

(async () => {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();

  for (const typeName of TYPES) {
    await client.query(`DROP TYPE IF EXISTS "public"."${typeName}" CASCADE;`);
    console.log(`Dropped type (if existed): ${typeName}`);
  }

  await client.end();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
