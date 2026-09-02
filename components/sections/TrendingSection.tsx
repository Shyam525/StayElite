"use client";

import { Flame } from "lucide-react";
import { ListingCard } from "@/components/ListingCard";
import { MOCK_LISTINGS } from "@/hooks/useListings";

export function TrendingSection() {
  const trendingStays = MOCK_LISTINGS.slice(0, 4);

  return (
    <section className="py-12 bg-slate-50/60 border-y border-slate-200/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xl font-bold text-[#222222]">
            <Flame className="h-5 w-5 fill-[#FF385C] text-[#FF385C]" />
            <h2>Trending this week</h2>
          </div>
          <p className="text-xs text-[#717171] mt-0.5">The most saved and booked stays right now</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trendingStays.map((stay) => (
            <ListingCard key={stay.id} listing={stay} />
          ))}
        </div>
      </div>
    </section>
  );
}
