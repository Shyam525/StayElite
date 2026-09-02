"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Heart, Compass, Loader2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { ListingCard } from "@/components/ListingCard";
import { INITIAL_HOST_LISTINGS } from "@/services/hostService";
import type { ListingDetail } from "@/services/listingService";

export default function WishlistsPage() {
  const { wishlistIds, fetchWishlist, isLoading } = useWishlistStore();

  useEffect(() => {
    void fetchWishlist();
  }, [fetchWishlist]);

  // Combine initial host listings into listing cards if in wishlist set
  const savedListings: ListingDetail[] = INITIAL_HOST_LISTINGS.filter((l) =>
    wishlistIds.has(l.id)
  ).map((l) => ({
    id: l.id,
    title: l.title,
    description: "Luxurious stay with premium amenities.",
    propertyType: "Entire home",
    address: l.location,
    city: l.location.split(",")[0]?.trim(),
    country: l.location.split(",").slice(-1)[0]?.trim(),
    basePricePerNight: l.pricePerNight,
    maxGuests: l.maxGuests,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    averageRating: l.rating,
    reviewCount: l.reviewCount,
    photoUrls: [l.thumbnail],
    amenities: ["WiFi", "Pool", "Kitchen"],
    createdAt: l.updatedAt,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-20">
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 fill-rose-500 text-rose-500" />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Wishlists</h1>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Your saved luxury homes, beach villas, and alpine chalets.
        </p>
      </div>

      {isLoading && (
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-[#FF385C]" /> Loading your saved stays...
        </div>
      )}

      {!isLoading && savedListings.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {savedListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {!isLoading && savedListings.length === 0 && (
        <div className="mt-16 text-center max-w-md mx-auto py-12 px-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-500">
            <Heart className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-slate-900">Your wishlist is empty</h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            As you search, click the heart icon on any listing to save your favorite stays and compare them later.
          </p>
          <Link href="/explore">
            <button
              type="button"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
            >
              <Compass className="h-4 w-4" /> Start Exploring Stays
            </button>
          </Link>
        </div>
      )}
    </main>
  );
}
