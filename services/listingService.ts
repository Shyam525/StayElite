import api from "@/lib/axios";
import type { ListingDraft } from "@/store/listingDraftStore";

export type ListingCreatePayload = Omit<ListingDraft, "photos" | "amenities" | "propertyType" | "latitude" | "longitude"> & {
  propertyType: string;
  lat: number | null;
  lng: number | null;
  amenityIds: number[];
};

export async function createListing(payload: ListingCreatePayload) {
  const response = await api.post("/listings", payload);
  return response.data?.data ?? response.data;
}

export async function uploadListingPhotos(listingId: string, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await api.post(`/listings/${listingId}/photos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data?.data ?? response.data;
}
