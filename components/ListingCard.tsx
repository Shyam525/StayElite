"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { ListingItem } from "@/types/listing";
import { WishlistButton } from "@/components/WishlistButton";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, formatDateRange } from "@/lib/utils";

const fallbackPhotos = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
];

interface ListingCardProps {
  listing: ListingItem | any;
  isSaved?: boolean;
  displayTotalPrice?: boolean;
}

export function ListingCard({ listing, isSaved: isSavedProp, displayTotalPrice = false }: ListingCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const isWishlistedInStore = useWishlistStore((state) => state.isWishlisted(listing.id));
  const isSaved = isSavedProp !== undefined ? isSavedProp : isWishlistedInStore;

  const photos = listing.photoUrls?.length
    ? listing.photoUrls
    : listing.primaryPhotoUrl
    ? [listing.primaryPhotoUrl]
    : fallbackPhotos;

  const price = Number(listing.pricePerNight || listing.basePricePerNight || 0);
  const totalPrice = price * 5; // 5-night estimated stay

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const isGuestFavorite =
    listing.isGuestFavorite ||
    (listing.averageRating && listing.averageRating >= 4.9 && (listing.reviewCount || 0) > 40);

  return (
    <article className="group min-w-0 cursor-pointer">
      {/* PHOTO SECTION (1:1 Aspect Ratio Square) */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-2xs">
        <Link href={`/listings/${listing.id}`} aria-label={`View ${listing.title}`}>
          <img
            src={photos[currentPhotoIndex % photos.length]}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* TOP LEFT BADGE: Guest Favourite */}
        {isGuestFavorite && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1 text-[11px] font-bold text-[#222222] shadow-sm">
            Guest favourite
          </span>
        )}

        {/* TOP RIGHT: Wishlist Button */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton listingId={listing.id} isSaved={isSaved} size="sm" />
        </div>

        {/* Hover Arrow Controls */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevPhoto}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-800 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNextPhoto}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-800 opacity-0 shadow-md transition group-hover:opacity-100 hover:bg-white z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Bottom Pagination Dot Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 z-10">
            {photos.slice(0, 5).map((_photo: string, idx: number) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  idx === currentPhotoIndex % photos.length
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <Link href={`/listings/${listing.id}`} className="block pt-3 space-y-0.5">
        {/* Row 1: City, Country & Rating */}
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-[#222222]">
            {[listing.city, listing.country].filter(Boolean).join(", ") || listing.title}
          </p>
          {listing.averageRating ? (
            <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#222222]">
              <Star className="h-3.5 w-3.5 fill-[#222222] text-[#222222]" />
              {Number(listing.averageRating).toFixed(1)}
            </span>
          ) : null}
        </div>

        {/* Row 2: Property Type */}
        <p className="truncate text-sm text-[#717171]">
          {listing.propertyType || "Entire villa"}
        </p>

        {/* Row 3: Dates */}
        <p className="truncate text-sm text-[#717171]">
          {listing.availableDates || formatDateRange()}
        </p>

        {/* Row 4: Pricing */}
        <div className="pt-1">
          <p className="text-sm text-[#222222]">
            <strong className="font-bold">{formatPrice(price)}</strong>{" "}
            <span className="text-sm font-normal text-[#717171]">night</span>
          </p>
          {displayTotalPrice && (
            <p className="text-xs text-[#717171] underline font-medium">
              {formatPrice(totalPrice)} total before taxes
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function ListingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl bg-slate-200" />
      <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />
      <div className="mt-1.5 h-3 w-1/2 rounded bg-slate-200" />
      <div className="mt-1.5 h-3 w-1/3 rounded bg-slate-200" />
      <div className="mt-2.5 h-4 w-1/4 rounded bg-slate-200" />
    </div>
  );
}
