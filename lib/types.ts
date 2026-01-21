export interface Restaurant {
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

export interface ClaimRequest {
  id: string;
  restaurant_id: string;
  owner_name: string;
  owner_email: string;
  owner_phone: string;
  role: string;
  verification_method: string;
  status: "pending" | "approved" | "rejected";
  verification_notes: string;
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
}

export interface ClaimWithRestaurant extends ClaimRequest {
  restaurant: Restaurant;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin";
}

export type CreateRestaurant = Omit<Restaurant, "id" | "created_at" | "updated_at">;
export type CreateClaimRequest = Omit<ClaimRequest, "id" | "created_at">;
