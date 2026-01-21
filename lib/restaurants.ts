import { query, queryOne, execute } from "./db";
import type { Restaurant, CreateRestaurant } from "./types";

interface DbRestaurant {
  id: string;
  name: string;
  slug: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  cuisine: string[];
  phone: string;
  website: string;
  hours: string;
  photos: string[];
  claimed: boolean;
  claimed_at: Date | null;
  owner_id: string | null;
  chef_dish: string | null;
  chef_description: string | null;
  chef_photo: string | null;
  chef_updated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

function toRestaurant(row: DbRestaurant): Restaurant {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    street: row.street,
    city: row.city,
    state: row.state,
    zip: row.zip,
    latitude: row.latitude,
    longitude: row.longitude,
    cuisine: row.cuisine || [],
    phone: row.phone,
    website: row.website,
    hours: row.hours,
    photos: row.photos || [],
    claimed: row.claimed,
    claimed_at: row.claimed_at,
    owner_id: row.owner_id,
    chef_dish: row.chef_dish,
    chef_description: row.chef_description,
    chef_photo: row.chef_photo,
    chef_updated_at: row.chef_updated_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function getRestaurants(limit = 20, offset = 0): Promise<Restaurant[]> {
  const rows = await query<DbRestaurant>(
    `SELECT * FROM restaurants ORDER BY name ASC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  return rows.map(toRestaurant);
}

export async function getRestaurantBySlug(city: string, slug: string): Promise<Restaurant | null> {
  const row = await queryOne<DbRestaurant>(
    `SELECT * FROM restaurants WHERE slug = $1 AND LOWER(city) = LOWER($2)`,
    [slug, city]
  );
  return row ? toRestaurant(row) : null;
}

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const row = await queryOne<DbRestaurant>(
    `SELECT * FROM restaurants WHERE id = $1`,
    [id]
  );
  return row ? toRestaurant(row) : null;
}

export async function searchRestaurants(searchQuery: string, limit = 10): Promise<Restaurant[]> {
  const pattern = `%${searchQuery}%`;
  const rows = await query<DbRestaurant>(
    `SELECT * FROM restaurants
     WHERE name ILIKE $1 OR city ILIKE $1 OR zip ILIKE $1
     ORDER BY
       CASE WHEN name ILIKE $2 THEN 0 ELSE 1 END,
       name ASC
     LIMIT $3`,
    [pattern, `${searchQuery}%`, limit]
  );
  return rows.map(toRestaurant);
}

export async function createRestaurant(restaurant: CreateRestaurant): Promise<string> {
  const result = await queryOne<{ id: string }>(
    `INSERT INTO restaurants (
      name, slug, street, city, state, zip, latitude, longitude,
      cuisine, phone, website, hours, photos,
      claimed, claimed_at, owner_id,
      chef_dish, chef_description, chef_photo, chef_updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8,
      $9, $10, $11, $12, $13,
      $14, $15, $16,
      $17, $18, $19, $20
    ) RETURNING id`,
    [
      restaurant.name,
      restaurant.slug,
      restaurant.street,
      restaurant.city,
      restaurant.state,
      restaurant.zip,
      restaurant.latitude,
      restaurant.longitude,
      restaurant.cuisine,
      restaurant.phone,
      restaurant.website,
      restaurant.hours,
      restaurant.photos,
      restaurant.claimed,
      restaurant.claimed_at,
      restaurant.owner_id,
      restaurant.chef_dish,
      restaurant.chef_description,
      restaurant.chef_photo,
      restaurant.chef_updated_at,
    ]
  );
  return result!.id;
}

export async function updateRestaurantRecommendation(
  id: string,
  recommendation: { dish: string; description: string; photo: string | null }
): Promise<number> {
  return execute(
    `UPDATE restaurants SET
      chef_dish = $1,
      chef_description = $2,
      chef_photo = $3,
      chef_updated_at = NOW(),
      updated_at = NOW()
     WHERE id = $4`,
    [recommendation.dish, recommendation.description, recommendation.photo, id]
  );
}

export async function markRestaurantClaimed(id: string, ownerId: string): Promise<number> {
  return execute(
    `UPDATE restaurants SET
      claimed = true,
      claimed_at = NOW(),
      owner_id = $1,
      updated_at = NOW()
     WHERE id = $2`,
    [ownerId, id]
  );
}

export async function getRestaurantStats(): Promise<{
  total: number;
  claimed: number;
}> {
  const result = await queryOne<{ total: string; claimed: string }>(
    `SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE claimed = true) as claimed
     FROM restaurants`
  );

  return {
    total: parseInt(result?.total || "0", 10),
    claimed: parseInt(result?.claimed || "0", 10),
  };
}
