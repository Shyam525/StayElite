"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, RefreshCw } from "lucide-react";
import ListingCard, { ListingCardSkeleton } from "./ListingCard";
import { useListings } from "@/hooks/useListings";
import type { ListingItem } from "@/types/listing";

interface ListingGridProps {
  listings?: ListingItem[];
  isLoading?: boolean;
  isError?: boolean;
  hasMore?: boolean;
  onFetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  onResetFilters?: () => void;
  displayTotalPrice?: boolean;
}

export default function ListingGrid({
  listings: propListings,
  isLoading: propIsLoading,
  isError: propIsError,
  hasMore: propHasMore,
  onFetchNextPage: propOnFetchNextPage,
  isFetchingNextPage: propIsFetchingNextPage,
  onResetFilters,
  displayTotalPrice = false,
}: ListingGridProps) {
  const hookResult = useListings();

  const listings = propListings ?? hookResult.listings;
  const total = hookResult.total || listings.length;
  const isLoading = propIsLoading ?? hookResult.isLoading;
  const isFetchingMore = propIsFetchingNextPage ?? hookResult.isFetchingNextPage;
  const hasNextPage = propHasMore ?? hookResult.hasNextPage;
  const fetchNextPage = propOnFetchNextPage ?? hookResult.fetchNextPage;
  const isError = propIsError ?? hookResult.isError;
  const refetch = hookResult.refetch;
  const filters = hookResult.filters;

  // Infinite scroll sentinel
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingMore, fetchNextPage]);

  // Section heading based on active filters
  const getHeading = () => {
    if (filters.city) return `Homes in ${filters.city}`;
    if (filters.category) {
      const label =
        filters.category.charAt(0).toUpperCase() +
        filters.category.slice(1).replace(/-/g, " ");
      return `${label} Stays`;
    }
    return "All Homes";
  };

  const handleClearFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    } else {
      window.history.pushState({}, "", "/");
      window.location.reload();
    }
  };

  // ── 1. LOADING STATE ──────────────────────────────
  if (isLoading) {
    return (
      <section className="px-4 sm:px-6 py-8 max-w-[2000px] mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <ListingCardSkeleton />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // ── 2. ERROR STATE ────────────────────────────────
  if (isError) {
    return (
      <section className="px-6 py-20 flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <RefreshCw className="text-red-500" size={28} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
        <p className="text-gray-500 text-sm">Unable to load listings right now.</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-6 py-2.5 bg-[#FF385C] text-white rounded-full text-sm font-medium hover:bg-[#E31C5F] transition-colors"
        >
          Try again
        </button>
      </section>
    );
  }

  // ── 3. EMPTY STATE ────────────────────────────────
  if (!isLoading && listings.length === 0) {
    return (
      <section className="px-6 py-20 flex flex-col items-center gap-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <Home className="text-gray-400" size={36} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">No places found</h2>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          Try adjusting your filters or searching in a different area.
          {filters.category ? ` There are no ${filters.category} stays matching your criteria.` : ""}
        </p>
        <button
          onClick={handleClearFilters}
          className="mt-2 px-6 py-2.5 border border-gray-900 text-gray-900 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Clear all filters
        </button>
      </section>
    );
  }

  // ── 4. LOADED STATE ───────────────────────────────
  return (
    <section className="px-4 sm:px-6 py-8 max-w-[2000px] mx-auto">
      {/* Section heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">{getHeading()}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {total} home{total !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        <AnimatePresence>
          {listings.map((listing, i) => (
            <motion.div
              key={listing.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
            >
              <ListingCard
                listing={listing}
                priority={i < 4}
                displayTotalPrice={displayTotalPrice}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-8">
        {isFetchingMore && (
          <div className="w-6 h-6 border-2 border-gray-300 border-t-[#FF385C] rounded-full animate-spin" />
        )}
        {!hasNextPage && listings.length > 0 && (
          <p className="text-sm text-gray-400">
            You've seen all {total} available homes
          </p>
        )}
      </div>
    </section>
  );
}

export { ListingGrid };
