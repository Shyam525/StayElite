"use client";

import { useState } from "react";
import { useFilters } from "@/hooks/useFilters";
import { useListings } from "@/hooks/useListings";
import { CategoryBar } from "@/components/CategoryBar";
import { FiltersDrawer } from "@/components/FiltersDrawer";
import { ListingGrid } from "@/components/ListingGrid";
import { HeroSection } from "@/components/sections/HeroSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { Footer } from "@/components/Footer";

export function ExplorePage() {
  const {
    city,
    category,
    checkIn,
    checkOut,
    guests,
    minPrice,
    maxPrice,
    bedrooms,
    propertyType,
    displayTotalPrice,
    clearFilters,
  } = useFilters();

  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  const filterParams = {
    city: city || undefined,
    category: category || undefined,
    checkIn: checkIn || undefined,
    checkOut: checkOut || undefined,
    guests: guests.adults + guests.children > 0 ? guests.adults + guests.children : undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < 1000 ? maxPrice : undefined,
    bedrooms: bedrooms || undefined,
    propertyType: propertyType.length > 0 ? propertyType.join(",") : undefined,
  };

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useListings(filterParams);

  const isFiltered = Boolean(city || category || checkIn || checkOut || minPrice > 0 || maxPrice < 1000 || bedrooms || propertyType.length > 0);

  // Flatten infinite query pages
  const allListings = data?.pages.flatMap((page) => page.items) || [];
  const totalCount = data?.pages[0]?.total || allListings.length;

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#222222]">
      {/* Hero Section (only when no search/category filter active) */}
      {!isFiltered && <HeroSection />}

      {/* Sticky Category Filter Bar */}
      <CategoryBar onOpenFilters={() => setIsFiltersDrawerOpen(true)} />

      {/* Homepage Feature Sections (only when no active filter) */}
      {!isFiltered && (
        <>
          <DestinationsSection />
          <TrendingSection />
        </>
      )}

      {/* Main Listing Section */}
      <main id="main-listings-grid" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Section Header Title */}
        <div className="mb-6">
          {city ? (
            <div>
              <h1 className="text-2xl font-extrabold text-[#222222]">
                Stays in {city}
              </h1>
              <p className="text-xs text-[#717171] mt-0.5">
                {totalCount} stays found {checkIn && checkOut ? `· ${checkIn} to ${checkOut}` : ""}
              </p>
            </div>
          ) : category ? (
            <div>
              <h1 className="text-2xl font-extrabold text-[#222222] capitalize">
                {category} Stays
              </h1>
              <p className="text-xs text-[#717171] mt-0.5">{totalCount} homes available</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-extrabold text-[#222222]">
                All Luxury Stays
              </h2>
              <p className="text-[#717171] text-xs mt-0.5">Explore our handpicked collection of verified stays</p>
            </div>
          )}
        </div>

        {/* Responsive Listing Grid */}
        <ListingGrid
          listings={allListings}
          isLoading={isLoading}
          isError={isError}
          hasMore={hasNextPage}
          onFetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onResetFilters={clearFilters}
          displayTotalPrice={displayTotalPrice}
        />
      </main>

      {/* Trust Section */}
      {!isFiltered && <WhyUsSection />}

      {/* Filters Drawer Modal */}
      <FiltersDrawer
        isOpen={isFiltersDrawerOpen}
        onClose={() => setIsFiltersDrawerOpen(false)}
        totalResultsCount={totalCount}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ExplorePage;
