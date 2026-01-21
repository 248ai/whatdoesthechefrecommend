import { query, queryOne, execute } from "./db";
import type { ClaimRequest, ClaimWithRestaurant, CreateClaimRequest } from "./types";

interface DbClaim {
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

interface DbClaimWithRestaurant extends DbClaim {
  restaurant_name: string;
  restaurant_slug: string;
  restaurant_street: string;
  restaurant_city: string;
  restaurant_state: string;
  restaurant_zip: string;
  restaurant_cuisine: string[];
  restaurant_phone: string;
  restaurant_website: string;
  restaurant_claimed: boolean;
}

function toClaim(row: DbClaim): ClaimRequest {
  return {
    id: row.id,
    restaurant_id: row.restaurant_id,
    owner_name: row.owner_name,
    owner_email: row.owner_email,
    owner_phone: row.owner_phone,
    role: row.role,
    verification_method: row.verification_method,
    status: row.status,
    verification_notes: row.verification_notes,
    created_at: row.created_at,
    reviewed_at: row.reviewed_at,
    reviewed_by: row.reviewed_by,
  };
}

function toClaimWithRestaurant(row: DbClaimWithRestaurant): ClaimWithRestaurant {
  return {
    ...toClaim(row),
    restaurant: {
      id: row.restaurant_id,
      name: row.restaurant_name,
      slug: row.restaurant_slug,
      street: row.restaurant_street,
      city: row.restaurant_city,
      state: row.restaurant_state,
      zip: row.restaurant_zip,
      latitude: null,
      longitude: null,
      cuisine: row.restaurant_cuisine || [],
      phone: row.restaurant_phone || "",
      website: row.restaurant_website || "",
      hours: "",
      photos: [],
      claimed: row.restaurant_claimed,
      claimed_at: null,
      owner_id: null,
      chef_dish: null,
      chef_description: null,
      chef_photo: null,
      chef_updated_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  };
}

export async function createClaimRequest(claim: CreateClaimRequest): Promise<string> {
  const result = await queryOne<{ id: string }>(
    `INSERT INTO claims (
      restaurant_id, owner_name, owner_email, owner_phone,
      role, verification_method, status, verification_notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [
      claim.restaurant_id,
      claim.owner_name,
      claim.owner_email.toLowerCase(),
      claim.owner_phone,
      claim.role,
      claim.verification_method,
      claim.status,
      claim.verification_notes,
    ]
  );
  return result!.id;
}

export async function getClaimsByStatus(
  status: ClaimRequest["status"],
  limit = 50
): Promise<ClaimWithRestaurant[]> {
  const rows = await query<DbClaimWithRestaurant>(
    `SELECT
      c.*,
      r.name as restaurant_name,
      r.slug as restaurant_slug,
      r.street as restaurant_street,
      r.city as restaurant_city,
      r.state as restaurant_state,
      r.zip as restaurant_zip,
      r.cuisine as restaurant_cuisine,
      r.phone as restaurant_phone,
      r.website as restaurant_website,
      r.claimed as restaurant_claimed
    FROM claims c
    JOIN restaurants r ON c.restaurant_id = r.id
    WHERE c.status = $1
    ORDER BY c.created_at DESC
    LIMIT $2`,
    [status, limit]
  );
  return rows.map(toClaimWithRestaurant);
}

export async function getClaimById(id: string): Promise<ClaimRequest | null> {
  const row = await queryOne<DbClaim>(
    `SELECT * FROM claims WHERE id = $1`,
    [id]
  );
  return row ? toClaim(row) : null;
}

export async function updateClaimStatus(
  id: string,
  status: ClaimRequest["status"],
  reviewedBy: string,
  notes?: string
): Promise<number> {
  if (notes) {
    return execute(
      `UPDATE claims SET
        status = $1,
        reviewed_at = NOW(),
        reviewed_by = $2,
        verification_notes = $3
       WHERE id = $4`,
      [status, reviewedBy, notes, id]
    );
  }
  return execute(
    `UPDATE claims SET
      status = $1,
      reviewed_at = NOW(),
      reviewed_by = $2
     WHERE id = $3`,
    [status, reviewedBy, id]
  );
}

export async function getClaimStats(): Promise<{
  pending: number;
  approved: number;
  rejected: number;
}> {
  const rows = await query<{ status: string; count: string }>(
    `SELECT status, COUNT(*) as count FROM claims GROUP BY status`
  );

  const stats = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  for (const row of rows) {
    const count = parseInt(row.count, 10);
    if (row.status === "pending") stats.pending = count;
    else if (row.status === "approved") stats.approved = count;
    else if (row.status === "rejected") stats.rejected = count;
  }

  return stats;
}

export async function hasExistingClaim(
  restaurantId: string,
  email: string
): Promise<boolean> {
  const row = await queryOne<{ id: string }>(
    `SELECT id FROM claims
     WHERE restaurant_id = $1
       AND LOWER(owner_email) = LOWER($2)
       AND status IN ('pending', 'approved')
     LIMIT 1`,
    [restaurantId, email]
  );
  return !!row;
}
