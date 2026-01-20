/**
 * CSV Import Script for Restaurant Data
 *
 * Usage: bun run scripts/import-csv.ts <path-to-csv>
 *
 * Expected CSV format:
 * name,street,city,state,zip,cuisine,phone,website,hours
 * "Joe's Pizza","123 Main St","Seattle","WA","98101","Italian,Pizza","206-555-0123","joespizza.com","11am-10pm"
 */

import { MongoClient } from "mongodb";
import { createReadStream } from "fs";
import { parse } from "csv-parse";
import path from "path";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is required");
  process.exit(1);
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: bun run scripts/import-csv.ts <path-to-csv>");
  process.exit(1);
}

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
  const client = new MongoClient(MONGODB_URI!);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("chefrecommends");
    const collection = db.collection("restaurants");

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

    const restaurants = records.map((row) => ({
      name: row.name,
      slug: slugify(row.name, row.city),
      address: {
        street: row.street,
        city: row.city,
        state: row.state,
        zip: row.zip,
        coordinates: null,
      },
      cuisine: row.cuisine
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      phone: row.phone,
      website: row.website,
      hours: row.hours,
      photos: [],
      claimed: false,
      claimedAt: null,
      ownerId: null,
      chefRecommendation: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    // Insert in batches
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      const result = await collection.insertMany(batch);
      inserted += result.insertedCount;
      console.log(`Inserted ${inserted}/${restaurants.length} restaurants`);
    }

    console.log(`\nImport complete! ${inserted} restaurants added.`);

    // Create indexes for search
    console.log("\nCreating indexes...");

    await collection.createIndex({ name: "text", "address.city": "text" });
    await collection.createIndex({ slug: 1, "address.city": 1 }, { unique: true });
    await collection.createIndex({ "address.zip": 1 });
    await collection.createIndex({ claimed: 1 });

    console.log("Indexes created successfully");

    console.log(`
Next steps:
1. Set up Atlas Search index for autocomplete (see docs/atlas-search.md)
2. Run 'bun dev' to start the development server
3. Visit http://localhost:3000 to see your restaurants
    `);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

importCsv();
