import { SearchBar } from "@/components/search-bar";
import { Utensils, MessageCircle, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-hero-pattern min-h-[85vh] flex items-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--terracotta)] opacity-[0.03] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[var(--sage)] opacity-[0.05] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge - establishes product category immediately */}
            <div className="inline-flex items-center gap-2 bg-[var(--sage)]/10 text-[var(--sage)] px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Utensils className="h-4 w-4" />
              Restaurant directory
            </div>

            {/* Main headline - clear WHAT this is */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-normal text-[var(--charcoal)] mb-6 leading-[1.1] tracking-tight">
              Find out what the{" "}
              <span className="text-[var(--terracotta)]">chef</span>{" "}
              recommends
            </h1>

            <p className="text-xl md:text-2xl text-[var(--warm-gray)] mb-12 max-w-xl mx-auto leading-relaxed">
              A restaurant directory where every profile shows the chef&apos;s own pick from the menu.
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

      {/* How it works - Problem framing then solution */}
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

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--terracotta)]/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-serif text-[var(--terracotta)]">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-3 text-[var(--charcoal)]">Search restaurants</h3>
              <p className="text-[var(--warm-gray)] leading-relaxed">
                Look up any restaurant by name, city, or zip code
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--sage)]/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-serif text-[var(--sage)]">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-3 text-[var(--charcoal)]">See the chef&apos;s pick</h3>
              <p className="text-[var(--warm-gray)] leading-relaxed">
                Each verified profile shows the dish the chef actually recommends
              </p>
            </div>

            <div className="text-center p-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--terracotta)]/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-serif text-[var(--terracotta)]">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-3 text-[var(--charcoal)]">Order it</h3>
              <p className="text-[var(--warm-gray)] leading-relaxed">
                Walk in knowing exactly what to get
              </p>
            </div>
          </div>
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
