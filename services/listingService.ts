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
  date?: string;
  createdAt: string;
};

export async function getListing(id: string): Promise<ListingDetail> {
  const response = await api.get(`/listings/${id}`);
  return response.data?.data ?? response.data;
}

export type ListingSearchParams = {
  city?: string; checkIn?: string; checkOut?: string; guests?: number; minPrice?: number;
  maxPrice?: number; propertyType?: string; page?: number; size?: number;
};

export async function searchListings(params: ListingSearchParams) {
  const response = await api.get("/listings", { params });
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

export type PricingBreakdownResponse = {
  baseAmount: number;
  serviceFee: number;
  cleaningFee: number;
  total: number;
  nights: number;
};

export async function previewBooking(payload: CreateBookingPayload): Promise<PricingBreakdownResponse> {
  const response = await api.get("/bookings/preview", { params: payload });
  return response.data?.data ?? response.data;
}

export type ReviewCreatePayload = {
  bookingId: string;
  overallRating: number;
  cleanlinessRating: number;
  locationRating: number;
  valueRating: number;
  comment: string;
};

export async function createReview(payload: ReviewCreatePayload) {
  const response = await api.post("/reviews", payload);
  return response.data?.data ?? response.data;
}

export async function getReviewSummary(listingId: string) {
  const response = await api.get(`/reviews/listing/${listingId}/summary`);
  return response.data?.data ?? response.data;
}

export async function getListingReviews(listingId: string) {
  const response = await api.get(`/reviews/listing/${listingId}`, { params: { size: 20, sort: "createdAt,desc" } });
  return response.data?.data ?? response.data;
}

export type BookingListItem = {
  id: string;
  listingId: string;
  listingTitle: string;
  hostName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
};

export async function getMyBookings(status?: string): Promise<BookingListItem[]> {
  const response = await api.get("/bookings/my", { params: status ? { status } : undefined });
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
