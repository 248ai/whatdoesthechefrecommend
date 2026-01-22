import { NextResponse } from "next/server";
import { getAllRestaurantsForMap } from "@/lib/restaurants";

export async function GET() {
  try {
    const restaurants = await getAllRestaurantsForMap();

    // Transform to GeoJSON FeatureCollection for Mapbox
    const geojson = {
      type: "FeatureCollection" as const,
      features: restaurants.map((r) => ({
        type: "Feature" as const,
        properties: {
          id: r.id,
          name: r.name,
          slug: r.slug,
          city: r.city,
          state: r.state,
          claimed: r.claimed,
          chef_dish: r.chef_dish,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [r.longitude, r.latitude],
        },
      })),
    };

    return NextResponse.json(geojson);
  } catch (error) {
    console.error("Error fetching restaurants for map:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}
