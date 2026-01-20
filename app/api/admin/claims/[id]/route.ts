import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateClaimStatus, getClaimById } from "@/lib/claims";
import { markRestaurantClaimed } from "@/lib/restaurants";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { action, restaurantId, notes } = body;

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Get the claim to verify it exists
    const claim = await getClaimById(id);
    if (!claim) {
      return NextResponse.json({ error: "Claim not found" }, { status: 404 });
    }

    // Update the claim status
    const status = action === "approve" ? "approved" : "rejected";
    await updateClaimStatus(id, status, session.user?.email || "admin", notes);

    // If approved, mark the restaurant as claimed
    if (action === "approve" && restaurantId) {
      await markRestaurantClaimed(restaurantId, id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Claim update error:", error);
    return NextResponse.json(
      { error: "Failed to update claim" },
      { status: 500 }
    );
  }
}
