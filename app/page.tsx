import Image from "next/image";
import { SearchBar } from "@/components/search-bar";
import { Utensils, MessageCircle, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-pattern min-h-[85vh] flex items-center overflow-hidden">
        {/* Food image collage - decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top left dish */}
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full overflow-hidden opacity-20 blur-[1px]">
            <Image
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>
          {/* Top right dish */}
          <div className="absolute top-20 -right-20 w-96 h-96 rounded-full overflow-hidden opacity-15 blur-[1px]">
            <Image
              src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>
          {/* Bottom left dish */}
          <div className="absolute bottom-10 left-20 w-64 h-64 rounded-full overflow-hidden opacity-15 blur-[1px]">
            <Image
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>
          {/* Bottom right dish */}
          <div className="absolute -bottom-20 right-40 w-80 h-80 rounded-full overflow-hidden opacity-10 blur-[1px]">
            <Image
              src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=500&fit=crop"
              alt=""
              fill
              className="object-cover"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[var(--sage)]/10 text-[var(--sage)] px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Utensils className="h-4 w-4" />
              Free for diners
            </div>

            {/* Main headline */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-[var(--charcoal)] mb-6 leading-[1.1] tracking-tight">
              Find out what the{" "}
              <span className="text-[var(--terracotta)]">chef</span>{" "}
              recommends
            </h1>

            <p className="text-xl md:text-2xl text-[var(--warm-gray)] mb-12 max-w-xl mx-auto leading-relaxed">
              Search any restaurant. See the one dish the chef says you should order.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto">
              <SearchBar />
              <p className="mt-4 text-sm text-[var(--warm-gray)]">
                Search by restaurant name, city, or zip code
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
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
              <h3 className="font-semibold text-lg mb-2 text-[var(--charcoal)]">Search restaurants</h3>
              <p className="text-[var(--warm-gray)] text-sm leading-relaxed">
                Look up any restaurant by name, city, or zip code
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
