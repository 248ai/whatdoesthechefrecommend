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

    const serialized = results.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      city: r.city,
      state: r.state,
      cuisine: r.cuisine,
      claimed: r.claimed,
    }));

    return NextResponse.json({ results: serialized });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
