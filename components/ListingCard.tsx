"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatPrice } from "@/lib/utils";
import type { ListingResponse } from "@/types/listing";
import { WishlistButton } from "@/components/WishlistButton";

interface ListingCardProps {
  listing: ListingResponse | any;
  isSaved?: boolean;
  onWishlistToggle?: (id: string) => void;
  priority?: boolean;
  displayTotalPrice?: boolean;
}

export default function ListingCard({
  listing,
  isSaved = false,
  onWishlistToggle,
  priority = false,
  displayTotalPrice = false,
}: ListingCardProps) {
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const touchStartX = useRef<number>(0);

  const photos =
    listing.photos?.length > 0
      ? listing.photos
      : listing.photoUrls?.length > 0
      ? listing.photoUrls
      : listing.primaryPhotoUrl
      ? [listing.primaryPhotoUrl]
      : ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"];

  const price = listing.basePricePerNight || listing.pricePerNight || 0;
  const totalPrice = price * 5;

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev + 1) % photos.length);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) setCurrentPhoto((prev) => (prev + 1) % photos.length);
      else setCurrentPhoto((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 300);
    onWishlistToggle?.(listing.id);
  };

  return (
    <Link href={`/listings/${listing.id}`} className="group block cursor-pointer">
      {/* PHOTO SECTION */}
      <div
        className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Photos */}
        {photos.map((photo: string, index: number) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-300",
              index === currentPhoto ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={photo}
              alt={`${listing.title} - photo ${index + 1}`}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                isHovered && "scale-105"
              )}
              priority={priority && index === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${listing.id}/800/800`;
              }}
            />
          </div>
        ))}

        {/* Guest Favourite Badge */}
        {listing.isGuestFavorite && (
          <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs rounded-full px-3 py-1 text-xs font-semibold text-gray-800 shadow-md">
            Guest favourite
          </div>
        )}

        {/* Wishlist Heart */}
        <div className="absolute top-3 right-3 z-10">
          {onWishlistToggle ? (
            <button
              onClick={handleWishlist}
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-all shadow-sm"
              aria-label="Save wishlist"
            >
              <motion.div
                animate={heartAnimating ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Heart
                  size={18}
                  className={cn(
                    "transition-colors",
                    isSaved
                      ? "fill-[#FF385C] stroke-[#FF385C]"
                      : "stroke-gray-700 fill-transparent"
                  )}
                />
              </motion.div>
            </button>
          ) : (
            <WishlistButton listingId={listing.id} isSaved={isSaved} size="sm" />
          )}
        </div>

        {/* Prev/Next Arrows */}
        {photos.length > 1 && isHovered && (
          <>
            {currentPhoto > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Previous photo"
              >
                <ChevronLeft size={14} className="text-gray-800" />
              </button>
            )}
            {currentPhoto < photos.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Next photo"
              >
                <ChevronRight size={14} className="text-gray-800" />
              </button>
            )}
          </>
        )}

        {/* Dot Indicators */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {photos.map((_: any, index: number) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentPhoto(index);
                }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  index === currentPhoto ? "bg-white scale-110" : "bg-white/60"
                )}
                aria-label={`Photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="mt-3 space-y-1">
        {/* Row 1: Location + Rating */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 truncate flex-1">
            {[listing.city, listing.country].filter(Boolean).join(", ") || listing.title}
          </p>
          {(listing.reviewCount > 0 || listing.averageRating) && (
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Star size={12} className="fill-gray-900 stroke-gray-900" />
              <span className="text-sm text-gray-900">
                {Number(listing.averageRating || 4.9).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Row 2: Property Type */}
        <p className="text-sm text-gray-500 capitalize">
          {typeof listing.propertyType === "string"
            ? listing.propertyType.toLowerCase()
            : "Entire villa"}
        </p>

        {/* Row 3: Dates */}
        <p className="text-sm text-gray-500">
          {listing.availableDates || "Available now"}
        </p>

        {/* Row 4: Price */}
        <p className="text-sm text-gray-900 pt-0.5">
          <span className="font-semibold">{formatPrice(price)}</span>
          <span className="text-gray-500 font-normal"> / night</span>
        </p>
        {displayTotalPrice && (
          <p className="text-xs text-gray-500 underline font-medium">
            {formatPrice(totalPrice)} total before taxes
          </p>
        )}
      </div>
    </Link>
  );
}

// ── SKELETON variant ──────────────────────────────────────
export function ListingCardSkeleton() {
  return (
    <div className="block">
      <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-8 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/5 animate-pulse" />
      </div>
    </div>
  );
}

export const ListingSkeleton = ListingCardSkeleton;
export { ListingCard };
