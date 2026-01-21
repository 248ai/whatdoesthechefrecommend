import { notFound } from "next/navigation";
import Link from "next/link";
import { Utensils, ArrowLeft } from "lucide-react";
import { ClaimForm } from "@/components/claim-form";
import { getRestaurantById } from "@/lib/restaurants";

interface ClaimPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { id } = await params;

  // Validate UUID format (PostgreSQL uses UUIDs)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const restaurant = await getRestaurantById(id);

  if (!restaurant) {
    notFound();
  }

  if (restaurant.claimed) {
    return (
      <main className="min-h-screen bg-[var(--cream)]">
        <header className="border-b border-[var(--border)] bg-white">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center gap-2 text-[var(--charcoal)]">
              <Utensils className="h-6 w-6 text-[var(--terracotta)]" />
              <span className="font-semibold">Chef Recommends</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16 max-w-lg text-center">
          <h1 className="font-serif text-3xl text-[var(--charcoal)] mb-4">Restaurant Already Claimed</h1>
          <p className="text-[var(--warm-gray)] mb-6">
            {restaurant.name} has already been claimed by its owner.
          </p>
          <Link
            href={`/${restaurant.city.toLowerCase().replace(/\s+/g, "-")}/${restaurant.slug}`}
            className="text-[var(--terracotta)] font-medium hover:underline"
          >
            View restaurant profile
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      <header className="border-b border-[var(--border)] bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-[var(--charcoal)]">
            <Utensils className="h-6 w-6 text-[var(--terracotta)]" />
            <span className="font-semibold">Chef Recommends</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm max-w-lg mx-auto">
          <Link
            href={`/${restaurant.city.toLowerCase().replace(/\s+/g, "-")}/${restaurant.slug}`}
            className="inline-flex items-center gap-1 text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {restaurant.name}
          </Link>
        </div>

        <ClaimForm
          restaurantId={restaurant.id}
          restaurantName={restaurant.name}
        />
      </div>
    </main>
  );
}
