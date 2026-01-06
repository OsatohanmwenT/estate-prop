require("dotenv").config();

const { Client } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing");
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log("🔌 Connected to database");

    // Get all table names from public schema
    const result = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      AND tablename != 'drizzle_migrations'
      ORDER BY tablename;
    `);

    const tables = result.rows.map((row) => row.tablename);
    
    if (tables.length === 0) {
      console.log("ℹ️  No tables found to clear");
      await client.end();
      console.log("👋 Disconnected from database");
      return;
    }

    console.log(`📋 Found ${tables.length} tables to clear:`, tables);

    // Use TRUNCATE CASCADE to handle foreign key constraints automatically
    const tableList = tables.map(t => `"${t}"`).join(", ");
    
    try {
      await client.query(`TRUNCATE TABLE ${tableList} RESTART IDENTITY CASCADE;`);
      console.log(`\n✅ Successfully cleared all tables and reset sequences!`);
    } catch (err) {
      console.error("\n❌ Error clearing tables:", err.message);
      throw err;
    }
    
    await client.end();
    console.log("👋 Disconnected from database");
    
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    try {
      await client.end();
    } catch (endErr) {
      // Ignore if already closed
    }
    process.exit(1);
  }
})();
