import { NextResponse } from "next/server";
import { createClaimRequest, hasExistingClaim } from "@/lib/claims";
import { getRestaurantById } from "@/lib/restaurants";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      restaurantId,
      ownerName,
      ownerEmail,
      ownerPhone,
      role,
      verificationMethod,
    } = body;

    // Validate required fields
    if (
      !restaurantId ||
      !ownerName ||
      !ownerEmail ||
      !ownerPhone ||
      !role ||
      !verificationMethod
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if restaurant exists
    const restaurant = await getRestaurantById(restaurantId);
    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    // Check if restaurant is already claimed
    if (restaurant.claimed) {
      return NextResponse.json(
        { error: "This restaurant has already been claimed" },
        { status: 400 }
      );
    }

    // Check for existing claim from this email
    const existingClaim = await hasExistingClaim(
      restaurantId,
      ownerEmail.toLowerCase()
    );
    if (existingClaim) {
      return NextResponse.json(
        { error: "You have already submitted a claim for this restaurant" },
        { status: 400 }
      );
    }

    // Create the claim request
    const claimId = await createClaimRequest({
      restaurant_id: restaurantId,
      owner_name: ownerName.trim(),
      owner_email: ownerEmail.toLowerCase().trim(),
      owner_phone: ownerPhone.trim(),
      role,
      verification_method: verificationMethod.trim(),
      status: "pending",
      verification_notes: "",
      reviewed_at: null,
      reviewed_by: null,
    });

    return NextResponse.json({
      success: true,
      claimId,
    });
  } catch (error) {
    console.error("Claim submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit claim" },
      { status: 500 }
    );
  }
}
