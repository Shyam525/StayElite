import { NextResponse } from "next/server";
import { INITIAL_HOST_LISTINGS } from "@/services/hostService";
import type { ListingDetail } from "@/services/listingService";

// Global in-memory & fallback store for wishlists
export let wishlistStore = new Set<string>(["prop-101", "prop-103"]);

export async function GET() {
  const wishlistedIds = Array.from(wishlistStore);

  // Convert host listings to ListingDetail format
  const listings: ListingDetail[] = INITIAL_HOST_LISTINGS.filter((l) =>
    wishlistedIds.includes(l.id)
  ).map((l) => ({
    id: l.id,
    title: l.title,
    description: "A breathtaking stay with luxury amenities, panoramic views, and unmatched comfort.",
    propertyType: "Entire villa",
    address: l.location,
    city: l.location.split(",")[0]?.trim(),
    country: l.location.split(",").slice(-1)[0]?.trim(),
    basePricePerNight: l.pricePerNight,
    maxGuests: l.maxGuests,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    averageRating: l.rating,
    photoUrls: [l.thumbnail],
    amenities: ["WiFi", "Pool", "Kitchen", "Air conditioning", "Free parking"],
    createdAt: l.updatedAt,
  }));

  return NextResponse.json({
    success: true,
    data: listings,
    total: listings.length,
  });
}
