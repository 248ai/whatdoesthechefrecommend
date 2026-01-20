import { Suspense } from "react";
import Link from "next/link";
import { Utensils, ArrowLeft } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import { RestaurantCard } from "@/components/restaurant-card";
import { searchRestaurants, getRestaurants } from "@/lib/restaurants";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function SearchResults({ query }: { query: string }) {
  const results = query
    ? await searchRestaurants(query, 20)
    : await getRestaurants(20);

  const serialized = results.map((r) => ({
    _id: r._id.toString(),
    name: r.name,
    slug: r.slug,
    address: r.address,
    cuisine: r.cuisine,
    phone: r.phone,
    website: r.website,
    hours: r.hours,
    claimed: r.claimed,
    chefRecommendation: r.chefRecommendation,
  }));

  if (serialized.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--warm-gray)] mb-4">
          No restaurants found{query ? ` for "${query}"` : ""}.
        </p>
        <Link href="/" className="text-[var(--terracotta)] font-medium hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {serialized.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-72 rounded-2xl bg-[var(--secondary)] animate-pulse"
        />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query = "" } = await searchParams;

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-white sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2 text-[var(--charcoal)]">
              <Utensils className="h-6 w-6 text-[var(--terracotta)]" />
              <span className="font-semibold hidden sm:inline">
                Chef Recommends
              </span>
            </Link>
          </div>
          <SearchBar />
        </div>
      </header>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-[var(--warm-gray)]">/</span>
          <span className="text-sm text-[var(--charcoal)]">
            {query ? `Results for "${query}"` : "All Restaurants"}
          </span>
        </div>

        <h1 className="font-serif text-3xl text-[var(--charcoal)] mb-8">
          {query ? `Restaurants matching "${query}"` : "Browse Restaurants"}
        </h1>

        <Suspense fallback={<LoadingSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      </div>
    </main>
  );
}
