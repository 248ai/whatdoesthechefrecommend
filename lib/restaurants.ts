import { ObjectId } from "mongodb";
import { getDb } from "./db";
import type { Restaurant, CreateRestaurant } from "./types";

export async function getRestaurants(limit = 20, skip = 0) {
  const db = await getDb();
  return db
    .collection<Restaurant>("restaurants")
    .find()
    .sort({ name: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
}

export async function getRestaurantBySlug(city: string, slug: string) {
  const db = await getDb();
  return db.collection<Restaurant>("restaurants").findOne({
    slug,
    "address.city": { $regex: new RegExp(`^${city}$`, "i") },
  });
}

export async function getRestaurantById(id: string) {
  const db = await getDb();
  return db
    .collection<Restaurant>("restaurants")
    .findOne({ _id: new ObjectId(id) });
}

export async function searchRestaurants(query: string, limit = 10) {
  const db = await getDb();

  // Use Atlas Search if available, otherwise fall back to regex
  try {
    const results = await db
      .collection<Restaurant>("restaurants")
      .aggregate([
        {
          $search: {
            index: "restaurant_search",
            autocomplete: {
              query,
              path: "name",
              fuzzy: { maxEdits: 1 },
            },
          },
        },
        { $limit: limit },
        {
          $project: {
            _id: 1,
            name: 1,
            slug: 1,
            address: 1,
            cuisine: 1,
            claimed: 1,
            score: { $meta: "searchScore" },
          },
        },
      ])
      .toArray();
    return results;
  } catch {
    // Fallback to regex search if Atlas Search isn't configured
    return db
      .collection<Restaurant>("restaurants")
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { "address.city": { $regex: query, $options: "i" } },
          { "address.zip": { $regex: query, $options: "i" } },
        ],
      })
      .limit(limit)
      .toArray();
  }
}

export async function createRestaurant(restaurant: CreateRestaurant) {
  const db = await getDb();
  const result = await db
    .collection<Restaurant>("restaurants")
    .insertOne(restaurant as Restaurant);
  return result.insertedId;
}

export async function updateRestaurantRecommendation(
  id: string,
  recommendation: Restaurant["chefRecommendation"]
) {
  const db = await getDb();
  return db.collection<Restaurant>("restaurants").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        chefRecommendation: recommendation,
        updatedAt: new Date(),
      },
    }
  );
}

export async function markRestaurantClaimed(
  id: string,
  ownerId: string
) {
  const db = await getDb();
  return db.collection<Restaurant>("restaurants").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        claimed: true,
        claimedAt: new Date(),
        ownerId: new ObjectId(ownerId),
        updatedAt: new Date(),
      },
    }
  );
}
