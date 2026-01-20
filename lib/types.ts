import type { ObjectId } from "mongodb";

export interface Restaurant {
  _id: ObjectId;
  name: string;
  slug: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    coordinates?: [number, number]; // [lng, lat]
  };
  cuisine: string[];
  phone: string;
  website: string;
  hours: string;
  photos: string[];

  // Claim status
  claimed: boolean;
  claimedAt: Date | null;
  ownerId: ObjectId | null;

  // Chef recommendation
  chefRecommendation: {
    dish: string;
    description: string;
    photo: string | null;
    updatedAt: Date;
  } | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ClaimRequest {
  _id: ObjectId;
  restaurantId: ObjectId;

  // Owner contact info
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  role: string; // "Owner", "Manager", "Chef"
  verificationMethod: string; // How they'd like to be verified

  // Status
  status: "pending" | "approved" | "rejected";
  verificationNotes: string;

  createdAt: Date;
  reviewedAt: Date | null;
  reviewedBy: string | null;
}

export interface AdminUser {
  _id: ObjectId;
  email: string;
  name: string;
  role: "admin";
}

// For creating new documents (without _id)
export type CreateRestaurant = Omit<Restaurant, "_id">;
export type CreateClaimRequest = Omit<ClaimRequest, "_id">;
