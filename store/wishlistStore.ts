import { create } from "zustand";
import toast from "react-hot-toast";
import { toggleWishlist as toggleWishlistApi, getUserWishlist as getWishlistApi } from "@/services/wishlistService";
import type { ListingDetail } from "@/services/listingService";

interface WishlistState {
  wishlistIds: Set<string>;
  wishlistedListings: ListingDetail[];
  isLoading: boolean;
  isWishlisted: (listingId: string) => boolean;
  toggleWishlist: (listing: ListingDetail) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: new Set<string>(["prop-101", "prop-103"]),
  wishlistedListings: [],
  isLoading: false,

  isWishlisted: (listingId: string) => {
    return get().wishlistIds.has(listingId);
  },

  toggleWishlist: async (listing: ListingDetail) => {
    const { wishlistIds, wishlistedListings } = get();
    const listingId = listing.id;
    const currentlyWishlisted = wishlistIds.has(listingId);

    // 1. OPTIMISTIC UPDATE
    const updatedIds = new Set(wishlistIds);
    let updatedListings = [...wishlistedListings];

    if (currentlyWishlisted) {
      updatedIds.delete(listingId);
      updatedListings = updatedListings.filter((l) => l.id !== listingId);
      toast.success("Removed from wishlist", {
        icon: "💔",
        style: { borderRadius: "16px", background: "#1e293b", color: "#fff", fontSize: "13px" },
      });
    } else {
      updatedIds.add(listingId);
      if (!updatedListings.some((l) => l.id === listingId)) {
        updatedListings.push(listing);
      }
      toast.success("Saved to wishlist", {
        icon: "❤️",
        style: { borderRadius: "16px", background: "#1e293b", color: "#fff", fontSize: "13px" },
      });
    }

    set({ wishlistIds: updatedIds, wishlistedListings: updatedListings });

    // 2. BACKEND API CALL WITH REVERT ON FAILURE
    try {
      await toggleWishlistApi(listingId);
    } catch (error) {
      console.error("Wishlist sync error:", error);
      toast.error("Failed to update wishlist. Reverting change.");
      set({ wishlistIds, wishlistedListings });
    }
  },

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const data = await getWishlistApi();
      const ids = new Set(data.map((item) => item.listingId));

      set({
        wishlistIds: ids,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
