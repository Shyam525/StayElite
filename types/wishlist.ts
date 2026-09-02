import type { ListingDetail } from "@/services/listingService";

export interface WishlistItem {
  id: string;
  listingId: string;
  userId: string;
  createdAt: string;
  listing: ListingDetail;
}

export interface WishlistToggleResponse {
  isWishlisted: boolean;
  listingId: string;
  message: string;
}
