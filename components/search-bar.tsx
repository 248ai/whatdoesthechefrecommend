"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  address: {
    city: string;
    state: string;
  };
  cuisine: string[];
}

export function SearchBar({ className }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    const city = result.address.city.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${city}/${result.slug}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      } else if (query.length >= 2) {
        router.push(`/search?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative w-full max-w-xl", className)}>
      <div className="relative">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--warm-gray)]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search restaurants, cities, or zip codes..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full h-14 pl-14 pr-6 text-lg bg-white border-2 border-[var(--border)] rounded-full shadow-sm focus:outline-none focus:border-[var(--terracotta)] focus:ring-4 focus:ring-[var(--terracotta)]/10 transition-all placeholder:text-[var(--warm-gray)]/60"
        />
      </div>

      {/* Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[var(--border)] rounded-2xl shadow-xl z-50 overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-[var(--warm-gray)]">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={result._id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full px-5 py-4 text-left hover:bg-[var(--secondary)] transition-colors flex items-start gap-4",
                      index === selectedIndex && "bg-[var(--secondary)]"
                    )}
                  >
                    <MapPin className="h-5 w-5 mt-0.5 text-[var(--terracotta)] shrink-0" />
                    <div>
                      <div className="font-medium text-[var(--charcoal)]">{result.name}</div>
                      <div className="text-sm text-[var(--warm-gray)]">
                        {result.address.city}, {result.address.state}
                        {result.cuisine.length > 0 && (
                          <span className="text-[var(--sage)]"> · {result.cuisine.slice(0, 2).join(", ")}</span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 text-center text-[var(--warm-gray)]">
              No restaurants found
            </div>
          )}

          {results.length > 0 && (
            <div className="border-t border-[var(--border)] px-5 py-3 bg-[var(--secondary)]/50">
              <button
                type="button"
                onClick={() => {
                  router.push(`/search?q=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="text-sm text-[var(--terracotta)] font-medium hover:underline"
              >
                See all results for &quot;{query}&quot;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
