import { ObjectId } from "mongodb";
import { getDb } from "./db";
import type { ClaimRequest, CreateClaimRequest } from "./types";

export async function createClaimRequest(claim: CreateClaimRequest) {
  const db = await getDb();
  const result = await db
    .collection<ClaimRequest>("claims")
    .insertOne(claim as ClaimRequest);
  return result.insertedId;
}

export async function getClaimsByStatus(
  status: ClaimRequest["status"],
  limit = 50
) {
  const db = await getDb();
  return db
    .collection<ClaimRequest>("claims")
    .aggregate([
      { $match: { status } },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurantId",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: "$restaurant" },
      { $sort: { createdAt: -1 } },
      { $limit: limit },
    ])
    .toArray();
}

export async function getClaimById(id: string) {
  const db = await getDb();
  return db
    .collection<ClaimRequest>("claims")
    .findOne({ _id: new ObjectId(id) });
}

export async function updateClaimStatus(
  id: string,
  status: ClaimRequest["status"],
  reviewedBy: string,
  notes?: string
) {
  const db = await getDb();
  return db.collection<ClaimRequest>("claims").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        status,
        reviewedAt: new Date(),
        reviewedBy,
        ...(notes && { verificationNotes: notes }),
      },
    }
  );
}

export async function getClaimStats() {
  const db = await getDb();
  const stats = await db
    .collection<ClaimRequest>("claims")
    .aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])
    .toArray();

  return {
    pending: stats.find((s) => s._id === "pending")?.count ?? 0,
    approved: stats.find((s) => s._id === "approved")?.count ?? 0,
    rejected: stats.find((s) => s._id === "rejected")?.count ?? 0,
  };
}

export async function hasExistingClaim(
  restaurantId: string,
  email: string
) {
  const db = await getDb();
  const existing = await db.collection<ClaimRequest>("claims").findOne({
    restaurantId: new ObjectId(restaurantId),
    ownerEmail: email.toLowerCase(),
    status: { $in: ["pending", "approved"] },
  });
  return !!existing;
}
