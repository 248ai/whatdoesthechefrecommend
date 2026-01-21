import Link from "next/link";
import { MapPin, Phone, Clock, Globe, Utensils, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    cuisine: string[];
    phone: string;
    website: string;
    hours: string;
    claimed: boolean;
    chef_dish: string | null;
    chef_description: string | null;
  };
  compact?: boolean;
}

export function RestaurantCard({ restaurant, compact = false }: RestaurantCardProps) {
  const citySlug = restaurant.city.toLowerCase().replace(/\s+/g, "-");
  const href = `/${citySlug}/${restaurant.slug}`;

  return (
    <Link href={href} className="block group">
      <div className="h-full bg-white border border-[var(--border)] rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:border-[var(--terracotta)]/30">
        <div className={cn("p-6", compact && "p-5")}>
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-lg text-[var(--charcoal)] group-hover:text-[var(--terracotta)] transition-colors">
                {restaurant.name}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-[var(--warm-gray)] mt-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{restaurant.city}, {restaurant.state}</span>
              </div>
            </div>
            {restaurant.claimed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--sage)]/10 text-[var(--sage)] text-xs font-medium shrink-0">
                <BadgeCheck className="h-3 w-3" />
                Verified
              </span>
            )}
          </div>

          {/* Cuisine tags */}
          {restaurant.cuisine.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {restaurant.cuisine.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-full bg-[var(--secondary)] text-[var(--charcoal)] text-xs font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Chef Recommendation */}
          <div className="bg-gradient-to-br from-[var(--terracotta)]/5 to-[var(--sage)]/5 rounded-xl p-4 mb-4 border border-[var(--terracotta)]/10">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--terracotta)] mb-2">
              <Utensils className="h-4 w-4" />
              Chef Recommends
            </div>
            {restaurant.chef_dish ? (
              <div>
                <p className="font-medium text-[var(--charcoal)]">
                  &ldquo;{restaurant.chef_dish}&rdquo;
                </p>
                {!compact && restaurant.chef_description && (
                  <p className="text-sm text-[var(--warm-gray)] mt-1.5 line-clamp-2">
                    {restaurant.chef_description}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-[var(--warm-gray)] italic">
                {restaurant.claimed
                  ? "Coming soon..."
                  : "Claim to add recommendation"}
              </p>
            )}
          </div>

          {/* Details */}
          {!compact && (
            <div className="space-y-2 text-sm text-[var(--warm-gray)]">
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
              {restaurant.hours && (
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{restaurant.hours}</span>
                </div>
              )}
              {restaurant.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="truncate">{restaurant.website}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
