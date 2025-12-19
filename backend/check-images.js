import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function checkImages() {
  try {
    const result = await sql`SELECT * FROM property_images`;
    console.log("property_images table data:", JSON.stringify(result, null, 2));
    console.log("Total images:", result.length);

    const properties = await sql`SELECT id, name FROM properties`;
    console.log("\nProperties:", JSON.stringify(properties, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

checkImages();
