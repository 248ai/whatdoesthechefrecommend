import { NextResponse } from "next/server";
import { searchRestaurants } from "@/lib/restaurants";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchRestaurants(query, 5);

    // Serialize ObjectIds to strings
    const serialized = results.map((r) => ({
      _id: r._id.toString(),
      name: r.name,
      slug: r.slug,
      address: r.address,
      cuisine: r.cuisine,
      claimed: r.claimed,
    }));

    return NextResponse.json({ results: serialized });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
