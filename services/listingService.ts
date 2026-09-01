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

export type ListingDetail = {
  id: string;
  title: string;
  description?: string;
  propertyType?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  basePricePerNight: number;
  cleaningFee?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  averageRating?: number;
  photoUrls?: string[];
  hostId?: string;
  hostName?: string;
  createdAt?: string;
  amenities?: string[];
  amenityIds?: number[];
  reviews?: ListingReview[];
  blockedDates?: string[];
  isSuperhost?: boolean;
};

export type ListingReview = {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl?: string;
  overallRating: number;
  cleanlinessRating?: number;
  locationRating?: number;
  valueRating?: number;
  comment: string;
  createdAt: string;
};

export async function getListing(id: string): Promise<ListingDetail> {
  const response = await api.get(`/listings/${id}`);
  return response.data?.data ?? response.data;
}

export type CreateBookingPayload = {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
};

export async function createBooking(payload: CreateBookingPayload) {
  const response = await api.post("/bookings", payload);
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
