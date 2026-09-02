"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, SearchX, RotateCcw, Loader2 } from "lucide-react";
import { ListingCard, ListingSkeleton } from "@/components/ListingCard";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { staggerContainer, fadeUp } from "@/lib/animations";
import type { ListingItem } from "@/types/listing";

interface ListingGridProps {
  listings: ListingItem[];
  isLoading: boolean;
  isError?: boolean;
  hasMore?: boolean;
  onFetchNextPage?: () => void;
  isFetchingNextPage?: boolean;
  onResetFilters?: () => void;
  displayTotalPrice?: boolean;
}

export function ListingGrid({
  listings,
  isLoading,
  isError = false,
  hasMore = false,
  onFetchNextPage,
  isFetchingNextPage = false,
  onResetFilters,
  displayTotalPrice = false,
}: ListingGridProps) {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    enabled: hasMore && !isFetchingNextPage,
  });

  useEffect(() => {
    if (isIntersecting && hasMore && onFetchNextPage && !isFetchingNextPage) {
      onFetchNextPage();
    }
  }, [isIntersecting, hasMore, onFetchNextPage, isFetchingNextPage]);

  // 1. LOADING INITIAL STATE
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 12 }).map((_, idx) => (
          <ListingSkeleton key={idx} />
        ))}
      </div>
    );
  }

  // 2. ERROR STATE
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-[#FF385C] mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-[#222222]">Something went wrong</h3>
        <p className="mt-1 text-xs text-[#717171]">We couldn't load the listings right now.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#222222] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-black transition"
        >
          <RotateCcw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  // 3. EMPTY STATE
  if (!listings || listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <SearchX className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-[#222222]">No places found</h3>
        <p className="mt-2 text-xs text-[#717171] leading-relaxed">
          Try adjusting your filters, searching in a different city, or expanding your price range.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-6 rounded-full bg-[#FF385C] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e42d4d] transition"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  // 4. LOADED GRID STATE
  return (
    <div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        <AnimatePresence mode="popLayout">
          {listings.map((item) => (
            <motion.div key={item.id} variants={fadeUp} layout>
              <ListingCard listing={item} displayTotalPrice={displayTotalPrice} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite Scroll Bottom Sentinel */}
      <div ref={targetRef} className="py-12 text-center">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#FF385C]" /> Loading more stays...
          </div>
        )}

        {!hasMore && listings.length > 0 && (
          <p className="text-xs font-medium text-slate-400">
            You've seen all available homes.
          </p>
        )}
      </div>
    </div>
  );
}
