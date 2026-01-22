"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  cuisine: string[];
  claimed: boolean;
  latitude: number | null;
  longitude: number | null;
}

interface MapSearchProps {
  onResultSelect?: (result: SearchResult) => void;
  onResultsFound?: (results: SearchResult[]) => void;
  className?: string;
}

export function MapSearch({ onResultSelect, onResultsFound, className }: MapSearchProps) {
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
      onResultsFound?.([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      const searchResults = data.results || [];
      setResults(searchResults);
      onResultsFound?.(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      onResultsFound?.([]);
    } finally {
      setIsLoading(false);
    }
  }, [onResultsFound]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    onResultSelect?.(result);
    setIsOpen(false);
    // Don't clear query so user can see what they searched for
  };

  const handleViewDetails = (result: SearchResult) => {
    const city = result.city.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${city}/${result.slug}`);
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
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    onResultsFound?.([]);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--warm-gray)]" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search restaurants..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full h-11 pl-10 pr-10 text-sm bg-white/95 backdrop-blur-sm border border-white/20 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--terracotta)]/30 transition-all placeholder:text-[var(--warm-gray)]/60"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-[var(--warm-gray)]" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-[var(--warm-gray)]">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-terracotta border-t-transparent rounded-full animate-spin" />
                Searching...
              </div>
            </div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((result, index) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(result)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-[var(--secondary)] transition-colors flex items-start gap-3",
                      index === selectedIndex && "bg-[var(--secondary)]"
                    )}
                  >
                    <MapPin className="h-4 w-4 mt-0.5 text-[var(--terracotta)] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-[var(--charcoal)] truncate">
                        {result.name}
                      </div>
                      <div className="text-xs text-[var(--warm-gray)]">
                        {result.city}, {result.state}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(result);
                      }}
                      className="text-xs text-[var(--terracotta)] hover:underline shrink-0"
                    >
                      Details →
                    </button>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-[var(--warm-gray)]">
              No restaurants found
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
