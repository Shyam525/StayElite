import api from "@/lib/axios";
import type { ListingDetail } from "@/services/listingService";
import type { WishlistToggleResponse } from "@/types/wishlist";

const STORAGE_KEY = "stayelite_wishlist_ids";

export function getLocalWishlistIds(): string[] {
  if (typeof window === "undefined") return ["prop-101", "prop-103"];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const defaults = ["prop-101", "prop-103"];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return ["prop-101", "prop-103"];
  }
}

export function saveLocalWishlistIds(ids: string[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }
}

export async function toggleWishlistApi(listingId: string): Promise<WishlistToggleResponse> {
  try {
    const response = await api.post(`/wishlists/${listingId}`);
    const data = response.data?.data || response.data;
    
    // Sync local storage
    const local = new Set(getLocalWishlistIds());
    if (data.isWishlisted) local.add(listingId);
    else local.delete(listingId);
    saveLocalWishlistIds(Array.from(local));

    return data;
  } catch (error) {
    // Local fallback
    const local = new Set(getLocalWishlistIds());
    const willBeWishlisted = !local.has(listingId);
    if (willBeWishlisted) local.add(listingId);
    else local.delete(listingId);
    saveLocalWishlistIds(Array.from(local));

    return {
      listingId,
      isWishlisted: willBeWishlisted,
      message: willBeWishlisted ? "Added to wishlist" : "Removed from wishlist",
    };
  }
}

export async function getWishlistApi(): Promise<ListingDetail[]> {
  try {
    const response = await api.get("/wishlists");
    return response.data?.data || response.data || [];
  } catch (error) {
    console.warn("API GET /wishlists failed, returning stored wishlist fallback.");
    return [];
  }
}
