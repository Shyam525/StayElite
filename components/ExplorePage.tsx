"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useFilters } from "@/hooks/useFilters";
import { CategoryBar } from "@/components/CategoryBar";
import { FiltersDrawer } from "@/components/FiltersDrawer";
import { ListingGrid } from "@/components/ListingGrid";
import { HeroSection } from "@/components/sections/HeroSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { TrendingSection } from "@/components/sections/TrendingSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { Footer } from "@/components/Footer";

export function ExplorePage() {
  const searchParams = useSearchParams();
  const { clearFilters } = useFilters();
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  const city = searchParams.get("city");
  const category = searchParams.get("category");
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  const isFiltered = Boolean(city || category || checkIn || checkOut);

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
      <main id="main-listings-grid" className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex-1">
        <ListingGrid onResetFilters={clearFilters} />
      </main>

      {/* Trust Section */}
      {!isFiltered && <WhyUsSection />}

      {/* Filters Drawer Modal */}
      <FiltersDrawer
        isOpen={isFiltersDrawerOpen}
        onClose={() => setIsFiltersDrawerOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default ExplorePage;
