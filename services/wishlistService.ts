import api from "@/lib/axios";
import type {
  WishlistToggleResponse,
  WishlistItemResponse,
  WishlistCollectionResponse,
  WishlistCollectionRequest,
} from "@/types/wishlist";

function unwrap<T>(response: { data?: { data?: T } | T }) {
  const body = response.data;
  return (body && typeof body === "object" && "data" in body ? body.data : body) as T;
}

export async function toggleWishlist(listingId: string): Promise<WishlistToggleResponse> {
  return unwrap<WishlistToggleResponse>(await api.post(`/wishlists/toggle/${listingId}`));
}

export async function getUserWishlist(): Promise<WishlistItemResponse[]> {
  return unwrap<WishlistItemResponse[]>(await api.get("/wishlists"));
}

export async function getWishlistStatus(listingIds: string[]): Promise<Record<string, boolean>> {
  if (!listingIds || listingIds.length === 0) return {};
  const params = new URLSearchParams();
  params.set("listingIds", listingIds.join(","));
  return unwrap<Record<string, boolean>>(await api.get(`/wishlists/status?${params.toString()}`));
}

export async function createCollection(name: string): Promise<WishlistCollectionResponse> {
  const payload: WishlistCollectionRequest = { name };
  return unwrap<WishlistCollectionResponse>(await api.post("/wishlists/collections", payload));
}

export async function getUserCollections(): Promise<WishlistCollectionResponse[]> {
  return unwrap<WishlistCollectionResponse[]>(await api.get("/wishlists/collections"));
}

export async function deleteCollection(collectionId: string): Promise<void> {
  await api.delete(`/wishlists/collections/${collectionId}`);
}

export async function addToCollection(collectionId: string, listingId: string): Promise<void> {
  await api.post(`/wishlists/collections/${collectionId}/listings/${listingId}`);
}

export async function removeFromCollection(collectionId: string, listingId: string): Promise<void> {
  await api.delete(`/wishlists/collections/${collectionId}/listings/${listingId}`);
}
