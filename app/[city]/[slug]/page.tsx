import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Utensils,
  MapPin,
  Phone,
  Clock,
  Globe,
  ArrowLeft,
  BadgeCheck,
  ExternalLink,
} from "lucide-react";
import { getRestaurantBySlug } from "@/lib/restaurants";

interface RestaurantPageProps {
  params: Promise<{ city: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: RestaurantPageProps): Promise<Metadata> {
  const { city, slug } = await params;
  const restaurant = await getRestaurantBySlug(city, slug);

  if (!restaurant) {
    return { title: "Restaurant Not Found" };
  }

  const description = restaurant.chefRecommendation
    ? `The chef at ${restaurant.name} recommends: ${restaurant.chefRecommendation.dish}`
    : `Discover what the chef recommends at ${restaurant.name}`;

  return {
    title: `${restaurant.name}`,
    description,
    openGraph: {
      title: `${restaurant.name} - Chef's Recommendation`,
      description,
    },
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { city, slug } = await params;
  const restaurant = await getRestaurantBySlug(city, slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--cream)]">
      {/* Header */}
      <header className="border-b border-[var(--border)] bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-[var(--charcoal)]">
              <Utensils className="h-6 w-6 text-[var(--terracotta)]" />
              <span className="font-semibold hidden sm:inline">
                Chef Recommends
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-[var(--warm-gray)]">/</span>
          <Link
            href={`/search?q=${encodeURIComponent(restaurant.address.city)}`}
            className="text-[var(--warm-gray)] hover:text-[var(--charcoal)] transition-colors"
          >
            {restaurant.address.city}
          </Link>
          <span className="text-[var(--warm-gray)]">/</span>
          <span className="text-[var(--charcoal)]">{restaurant.name}</span>
        </div>

        {/* Restaurant Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="font-serif text-4xl text-[var(--charcoal)]">{restaurant.name}</h1>
            {restaurant.claimed && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--sage)]/10 text-[var(--sage)] text-sm font-medium shrink-0">
                <BadgeCheck className="h-4 w-4" />
                Verified
              </span>
            )}
          </div>

          {/* Cuisine tags */}
          {restaurant.cuisine.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {restaurant.cuisine.map((c) => (
                <span
                  key={c}
                  className="px-3 py-1 rounded-full bg-[var(--secondary)] text-[var(--charcoal)] text-sm font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Chef Recommendation - The Star of the Show */}
        <div className="mb-8 bg-white border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-br from-[var(--terracotta)]/10 via-[var(--terracotta)]/5 to-[var(--sage)]/10 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--terracotta)]/20 flex items-center justify-center">
                <Utensils className="h-7 w-7 text-[var(--terracotta)]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[var(--charcoal)]">Chef Recommends</h2>
                <p className="text-sm text-[var(--warm-gray)]">
                  {restaurant.claimed
                    ? "Official recommendation"
                    : "Unclaimed profile"}
                </p>
              </div>
            </div>

            {restaurant.chefRecommendation ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--border)]">
                <p className="font-serif text-2xl md:text-3xl text-[var(--charcoal)] mb-3">
                  &ldquo;{restaurant.chefRecommendation.dish}&rdquo;
                </p>
                {restaurant.chefRecommendation.description && (
                  <p className="text-[var(--warm-gray)] leading-relaxed">
                    {restaurant.chefRecommendation.description}
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-[var(--border)] text-center">
                <p className="text-[var(--warm-gray)] mb-6">
                  This restaurant hasn&apos;t added a recommendation yet.
                </p>
                <Link
                  href={`/claim/${restaurant._id.toString()}`}
                  className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[var(--terracotta)]/90 transition-colors"
                >
                  Claim this restaurant
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="bg-white border border-[var(--border)] rounded-2xl p-6">
          <h3 className="font-semibold text-[var(--charcoal)] mb-5">Restaurant Details</h3>

          <div className="space-y-4">
            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[var(--terracotta)] mt-0.5" />
              <div>
                <p className="text-[var(--charcoal)]">{restaurant.address.street}</p>
                <p className="text-[var(--warm-gray)]">
                  {restaurant.address.city}, {restaurant.address.state}{" "}
                  {restaurant.address.zip}
                </p>
              </div>
            </div>

            {/* Phone */}
            {restaurant.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[var(--terracotta)]" />
                <a
                  href={`tel:${restaurant.phone}`}
                  className="text-[var(--charcoal)] hover:text-[var(--terracotta)] transition-colors"
                >
                  {restaurant.phone}
                </a>
              </div>
            )}

            {/* Hours */}
            {restaurant.hours && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[var(--terracotta)]" />
                <span className="text-[var(--charcoal)]">{restaurant.hours}</span>
              </div>
            )}

            {/* Website */}
            {restaurant.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-[var(--terracotta)]" />
                <a
                  href={
                    restaurant.website.startsWith("http")
                      ? restaurant.website
                      : `https://${restaurant.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--charcoal)] hover:text-[var(--terracotta)] transition-colors inline-flex items-center gap-1"
                >
                  {restaurant.website}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Claim CTA for unclaimed restaurants */}
        {!restaurant.claimed && (
          <div className="mt-10 text-center">
            <p className="text-[var(--warm-gray)] mb-4">
              Are you the owner of {restaurant.name}?
            </p>
            <Link
              href={`/claim/${restaurant._id.toString()}`}
              className="inline-flex items-center justify-center h-11 px-6 rounded-full border-2 border-[var(--terracotta)] text-[var(--terracotta)] font-medium hover:bg-[var(--terracotta)] hover:text-white transition-colors"
            >
              Claim this restaurant
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
