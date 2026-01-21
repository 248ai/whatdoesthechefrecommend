/**
 * CSV Import Script for Restaurant Data (PostgreSQL)
 *
 * Usage: DATABASE_URL=... bun run scripts/import-csv.ts <path-to-csv>
 *
 * Expected CSV format:
 * name,street,city,state,zip,cuisine,phone,website,hours
 * "Joe's Pizza","123 Main St","Seattle","WA","98101","Italian,Pizza","206-555-0123","joespizza.com","11am-10pm"
 */

import { Pool } from "pg";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import path from "path";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is required");
  process.exit(1);
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: bun run scripts/import-csv.ts <path-to-csv>");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

function slugify(name: string, city: string): string {
  const combined = `${name}-${city}`;
  return combined
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface CsvRow {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  cuisine: string;
  phone: string;
  website: string;
  hours: string;
}

async function importCsv() {
  try {
    console.log("Connecting to PostgreSQL...");
    await pool.query("SELECT NOW()");
    console.log("Connected successfully");

    const records: CsvRow[] = [];

    const parser = createReadStream(path.resolve(csvPath)).pipe(
      parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
      })
    );

    for await (const record of parser) {
      records.push(record as CsvRow);
    }

    console.log(`Parsed ${records.length} records from CSV`);

    // Insert in batches
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);

      for (const row of batch) {
        const cuisine = row.cuisine
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

        await pool.query(
          `INSERT INTO restaurants (
            name, slug, street, city, state, zip,
            cuisine, phone, website, hours,
            photos, claimed
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT DO NOTHING`,
          [
            row.name,
            slugify(row.name, row.city),
            row.street,
            row.city,
            row.state,
            row.zip,
            cuisine,
            row.phone,
            row.website,
            row.hours,
            [], // photos
            false, // claimed
          ]
        );
        inserted++;
      }

      console.log(`Inserted ${inserted}/${records.length} restaurants`);
    }

    console.log(`\nImport complete! ${inserted} restaurants processed.`);

    // Get count
    const countResult = await pool.query("SELECT COUNT(*) FROM restaurants");
    console.log(`Total restaurants in database: ${countResult.rows[0].count}`);

    console.log(`
Next steps:
1. Run 'bun dev' to start the development server
2. Visit http://localhost:3000 to see your restaurants
    `);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importCsv();
