/**
 * Database Schema Initialization Script
 *
 * Usage: DATABASE_URL=... bun run scripts/init-db.ts
 *
 * Creates the restaurants and claims tables if they don't exist.
 */

import { Pool } from "pg";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is required");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  zip VARCHAR(20) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cuisine TEXT[] DEFAULT '{}',
  phone VARCHAR(50) DEFAULT '',
  website VARCHAR(255) DEFAULT '',
  hours VARCHAR(255) DEFAULT '',
  photos TEXT[] DEFAULT '{}',
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP,
  owner_id UUID,
  chef_dish VARCHAR(255),
  chef_description TEXT,
  chef_photo VARCHAR(500),
  chef_updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  owner_name VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(50) NOT NULL,
  role VARCHAR(100) NOT NULL,
  verification_method TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verification_notes TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(255)
);

-- Indexes for restaurants
CREATE INDEX IF NOT EXISTS idx_restaurants_slug_city ON restaurants(slug, LOWER(city));
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(LOWER(city));
CREATE INDEX IF NOT EXISTS idx_restaurants_zip ON restaurants(zip);
CREATE INDEX IF NOT EXISTS idx_restaurants_claimed ON restaurants(claimed);
CREATE INDEX IF NOT EXISTS idx_restaurants_name_search ON restaurants USING gin(to_tsvector('english', name));

-- Indexes for claims
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_restaurant_id ON claims(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_claims_email ON claims(LOWER(owner_email));
`;

async function initDb() {
  try {
    console.log("Connecting to database...");
    await pool.query("SELECT NOW()");
    console.log("Connected successfully");

    console.log("Creating tables and indexes...");
    await pool.query(schema);
    console.log("Schema created successfully!");

    // Verify tables exist
    const tables = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('restaurants', 'claims')
    `);
    console.log("\nTables created:", tables.rows.map((r) => r.table_name).join(", "));

    console.log("\nDatabase initialization complete!");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDb();
