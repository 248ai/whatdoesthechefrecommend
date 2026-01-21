import { NextResponse } from "next/server";
import { query, execute } from "@/lib/db";

const schema = `
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  phone VARCHAR(50),
  website VARCHAR(255),
  hours VARCHAR(255),
  photos TEXT[] DEFAULT '{}',
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  owner_id UUID,
  chef_dish VARCHAR(255),
  chef_description TEXT,
  chef_photo VARCHAR(255),
  chef_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  owner_name VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(50) NOT NULL,
  role VARCHAR(100) NOT NULL,
  verification_method TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_city ON restaurants(city);
CREATE INDEX IF NOT EXISTS idx_restaurants_claimed ON restaurants(claimed);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_restaurant_id ON claims(restaurant_id);
`;

export async function GET(request: Request) {
  // Simple auth check via query param
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if tables exist
    const tables = await query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
    );

    const tableNames = tables.map((t) => t.tablename);

    if (tableNames.includes("restaurants") && tableNames.includes("claims")) {
      return NextResponse.json({
        message: "Tables already exist",
        tables: tableNames,
      });
    }

    // Run schema creation
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await execute(statement);
    }

    // Verify
    const newTables = await query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
    );

    return NextResponse.json({
      success: true,
      message: "Schema initialized",
      tables: newTables.map((t) => t.tablename),
    });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize database", details: String(error) },
      { status: 500 }
    );
  }
}
