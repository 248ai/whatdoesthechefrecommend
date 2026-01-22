"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import { Utensils, MessageCircle, Sparkles, ChevronDown } from "lucide-react";
import RestaurantMap from "@/components/map/restaurant-map";
import { MapSearch, SearchResult } from "@/components/map/map-search";

export default function Home() {
  const mapRef = useRef<{ flyTo: (lng: number, lat: number, zoom?: number) => void } | null>(null);

  const handleResultSelect = useCallback((result: SearchResult) => {
    // Fly to the selected restaurant on the map
    if (result.latitude && result.longitude) {
      // Access the map instance and fly to location
      const mapElement = document.querySelector('[data-map-container]');
      if (mapElement) {
        const event = new CustomEvent('flyTo', {
          detail: { lng: result.longitude, lat: result.latitude, zoom: 15 }
        });
        mapElement.dispatchEvent(event);
      }
    }
  }, []);

  const handleResultsFound = useCallback((results: SearchResult[]) => {
    // If we have results with coordinates, fit the map to show all of them
    const withCoords = results.filter(r => r.latitude && r.longitude);
    if (withCoords.length > 0) {
      const event = new CustomEvent('fitBounds', {
        detail: { results: withCoords }
      });
      document.querySelector('[data-map-container]')?.dispatchEvent(event);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Map Section - Full viewport */}
      <section className="relative h-[100svh] flex flex-col">
        {/* Header overlay */}
        <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2 text-[var(--charcoal)] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Utensils className="h-5 w-5 text-[var(--terracotta)]" />
              <span className="font-medium text-sm md:text-base">Chef Recommends</span>
            </div>

            {/* Search bar */}
            <MapSearch
              onResultSelect={handleResultSelect}
              onResultsFound={handleResultsFound}
              className="flex-1 max-w-sm md:max-w-md"
            />

            {/* Claim CTA - hidden on mobile */}
            <a
              href="/search"
              className="hidden md:inline-flex items-center justify-center h-10 px-5 rounded-full bg-[var(--terracotta)] text-white text-sm font-medium hover:bg-[var(--terracotta)]/90 transition-colors shadow-sm"
            >
              Claim restaurant
            </a>
          </div>
        </header>

        {/* Map */}
        <div className="flex-1 relative" data-map-container>
          <RestaurantMap />
        </div>

        {/* Bottom info card */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 px-6 py-4 max-w-sm text-center">
            <h1 className="font-serif text-lg md:text-xl text-[var(--charcoal)] mb-1">
              Find what the <span className="text-[var(--terracotta)]">chef</span> recommends
            </h1>
            <p className="text-sm text-[var(--warm-gray)] mb-3">
              Tap any pin to see the one dish worth ordering
            </p>
            <button
              onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 text-xs text-[var(--terracotta)] hover:underline"
            >
              Learn more <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-4 z-20 hidden md:block">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 px-4 py-3">
            <p className="text-xs text-[var(--warm-gray)] mb-2 font-medium">Legend</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-[var(--sage)] border-2 border-white shadow-sm"></span>
                <span className="text-[var(--charcoal)]">Verified</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-[var(--terracotta)] border-2 border-white shadow-sm"></span>
                <span className="text-[var(--charcoal)]">Unclaimed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-[var(--charcoal)] mb-4">
              How it works
            </h2>
            <p className="text-[var(--warm-gray)] max-w-lg mx-auto">
              Skip the 20-minute menu deliberation. Every restaurant profile shows one thing: what the chef would order.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&h=300&fit=crop"
                  alt="Restaurant interior"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="inline-block w-8 h-8 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] font-serif text-lg leading-8 mb-3">1</span>
              <h3 className="font-semibold text-lg mb-2 text-[var(--charcoal)]">Explore the map</h3>
              <p className="text-[var(--warm-gray)] text-sm leading-relaxed">
                Browse restaurants near you or search by name
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop"
                  alt="Beautifully plated dish"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="inline-block w-8 h-8 rounded-full bg-[var(--sage)]/10 text-[var(--sage)] font-serif text-lg leading-8 mb-3">2</span>
              <h3 className="font-semibold text-lg mb-2 text-[var(--charcoal)]">See the chef&apos;s pick</h3>
              <p className="text-[var(--warm-gray)] text-sm leading-relaxed">
                Each verified profile shows the dish the chef actually recommends
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto mb-6 shadow-lg">
                <Image
                  src="https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=300&h=300&fit=crop"
                  alt="Delicious meal"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <span className="inline-block w-8 h-8 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] font-serif text-lg leading-8 mb-3">3</span>
              <h3 className="font-semibold text-lg mb-2 text-[var(--charcoal)]">Order it</h3>
              <p className="text-[var(--warm-gray)] text-sm leading-relaxed">
                Walk in knowing exactly what to get
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food gallery - visual appeal */}
      <section className="py-16 bg-[var(--cream)] overflow-hidden">
        <div className="container mx-auto px-4 mb-12">
          <p className="text-center text-[var(--warm-gray)] text-sm uppercase tracking-wider">
            Dishes worth ordering
          </p>
        </div>
        <div className="flex gap-4 animate-scroll">
          {/* Duplicate images for seamless loop */}
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex gap-4">
              {[
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&h=300&fit=crop",
              ].map((src, i) => (
                <div key={`${setIndex}-${i}`} className="w-64 h-48 rounded-2xl overflow-hidden shrink-0 shadow-md">
                  <Image
                    src={src}
                    alt=""
                    width={256}
                    height={192}
                    className="object-cover w-full h-full"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Problem statement section - builds empathy */}
      <section className="py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <MessageCircle className="h-10 w-10 text-[var(--terracotta)] mx-auto mb-6 opacity-50" />
            <p className="font-serif text-2xl md:text-3xl text-[var(--charcoal)] mb-6 leading-relaxed">
              You know that moment when you&apos;re staring at a menu, overwhelmed by choices, wishing someone would just tell you what&apos;s actually good?
            </p>
            <p className="text-[var(--warm-gray)]">
              That&apos;s why we built this.
            </p>
          </div>
        </div>
      </section>

      {/* CTA for restaurant owners - clear value prop */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-[var(--border)] rounded-2xl p-10 text-center shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[var(--sage)]/10 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-6 w-6 text-[var(--sage)]" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-[var(--charcoal)] mb-4">
                For restaurant owners
              </h2>
              <p className="text-[var(--warm-gray)] mb-8 max-w-md mx-auto leading-relaxed">
                Claim your free profile to add your chef&apos;s recommendation. Verified restaurants get a badge and show up higher in search results.
              </p>
              <a
                href="/search"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[var(--terracotta)] text-white font-medium hover:bg-[var(--terracotta)]/90 transition-colors"
              >
                Claim your restaurant
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--border)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[var(--charcoal)]">
              <Utensils className="h-5 w-5 text-[var(--terracotta)]" />
              <span className="font-medium">Chef Recommends</span>
            </div>
            <p className="text-sm text-[var(--warm-gray)]">
              Made for hungry diners everywhere
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
