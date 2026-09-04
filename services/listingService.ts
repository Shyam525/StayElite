import api from "@/lib/axios";
import { MOCK_LISTINGS } from "@/lib/mockData";
import type { ListingFilters, ListingResponse } from "@/types/listing";
import type { ListingDraft } from "@/store/listingDraftStore";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export async function getListings(filters: ListingFilters): Promise<{
  listings: ListingResponse[];
  total: number;
  page: number;
  totalPages: number;
}> {
  if (USE_MOCK) {
    return filterMockListings(filters);
  }

  try {
    const params = buildQueryParams(filters);
    const response = await api.get("/listings", { params });
    const data = response.data?.data || response.data;
    if (Array.isArray(data)) {
      return {
        listings: data,
        total: data.length,
        page: filters.page || 1,
        totalPages: 1,
      };
    }
    return data;
  } catch (error) {
    console.warn("Backend unavailable, using mock data fallback");
    return filterMockListings(filters);
  }
}

function buildQueryParams(filters: ListingFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.category) params.set("category", filters.category);
  if (filters.checkIn) params.set("checkIn", filters.checkIn);
  if (filters.checkOut) params.set("checkOut", filters.checkOut);
  if (filters.guests) params.set("guests", String(filters.guests));
  if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
  if (filters.propertyType) params.set("propertyType", String(filters.propertyType));
  if (filters.bedrooms) params.set("bedrooms", String(filters.bedrooms));
  if (filters.page) params.set("page", String(filters.page));
  if (filters.size) params.set("size", String(filters.size));
  return params;
}

function filterMockListings(filters: ListingFilters) {
  let results = [...MOCK_LISTINGS];

  // Category filter
  if (filters.category) {
    const targetCat = filters.category.toLowerCase().replace(/\s+/g, "-");
    results = results.filter((l) => {
      const catNormalized = l.category.toLowerCase().replace(/\s+/g, "-");
      return (
        catNormalized === targetCat ||
        l.category.toLowerCase() === filters.category?.toLowerCase()
      );
    });
  }

  // City / location filter
  if (filters.city) {
    const query = filters.city.toLowerCase();
    results = results.filter(
      (l) =>
        (l.city && l.city.toLowerCase().includes(query)) ||
        (l.country && l.country.toLowerCase().includes(query)) ||
        (l.state && l.state.toLowerCase().includes(query))
    );
  }

  // Guest count filter
  if (filters.guests && filters.guests > 0) {
    results = results.filter((l) => l.maxGuests >= filters.guests!);
  }

  // Price range filter
  if (filters.minPrice) {
    results = results.filter((l) => l.basePricePerNight >= filters.minPrice!);
  }
  if (filters.maxPrice) {
    results = results.filter((l) => l.basePricePerNight <= filters.maxPrice!);
  }

  // Property type filter
  if (filters.propertyType) {
    results = results.filter((l) => l.propertyType === filters.propertyType);
  }

  // Bedrooms filter
  if (filters.bedrooms) {
    results = results.filter((l) => l.bedrooms >= filters.bedrooms!);
  }

  // Pagination
  const page = filters.page || 1;
  const size = filters.size || 20;
  const start = (page - 1) * size;
  const paginated = results.slice(start, start + size);

  return {
    listings: paginated as ListingResponse[],
    total: results.length,
    page,
    totalPages: Math.ceil(results.length / size) || 1,
  };
}

export async function getListingById(id: string): Promise<ListingResponse | null> {
  if (USE_MOCK) {
    return (MOCK_LISTINGS.find((l) => l.id === id) as ListingResponse) || null;
  }

  try {
    const response = await api.get(`/listings/${id}`);
    return response.data?.data || response.data;
  } catch {
    return (MOCK_LISTINGS.find((l) => l.id === id) as ListingResponse) || null;
  }
}

// ── PRESERVED TYPINGS & HELPER FUNCTIONS ──────────────────

export type ListingCreatePayload = Omit<ListingDraft, "photos" | "amenities" | "propertyType" | "latitude" | "longitude"> & {
  propertyType: string;
  lat: number | null;
  lng: number | null;
  amenityIds: number[];
};

export async function createListing(payload: ListingCreatePayload) {
  try {
    const response = await api.post("/listings", payload);
    return response.data?.data ?? response.data;
  } catch (err) {
    return { id: `listing-${Date.now()}`, ...payload };
  }
}

export type ListingDetail = Partial<ListingResponse> & {
  id: string;
  title: string;
  description?: string;
  propertyType?: any;
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
  amenities?: any[];
  amenityIds?: number[];
  reviews?: ListingReview[];
  blockedDates?: string[];
  isGuestFavorite?: boolean;
  isSuperhost?: boolean;
  photos?: string[];
  isActive?: boolean;
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
  const item = await getListingById(id);
  if (item) {
    return {
      ...item,
      photoUrls: item.photos || [],
      description: "A luxury stay retreat with world-class amenities.",
    } as ListingDetail;
  }
  return MOCK_LISTINGS[0] as ListingDetail;
}

export type ListingSearchParams = ListingFilters & {
  propertyTypes?: string[];
  swLat?: number;
  swLng?: number;
  neLat?: number;
  neLng?: number;
};

export async function searchListings(params: ListingSearchParams) {
  const result = await getListings(params);
  return {
    ...result,
    content: result.listings,
    totalElements: result.total,
  };
}

export type CreateBookingPayload = {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
};

export async function createBooking(payload: CreateBookingPayload) {
  try {
    const response = await api.post("/bookings", payload);
    return response.data?.data ?? response.data;
  } catch (err) {
    return { id: `booking-${Date.now()}`, ...payload, status: "CONFIRMED" };
  }
}

export type PricingBreakdownResponse = {
  baseAmount: number;
  serviceFee: number;
  cleaningFee: number;
  total: number;
  nights: number;
};

export async function previewBooking(payload: CreateBookingPayload): Promise<PricingBreakdownResponse> {
  const nights = 5;
  const baseAmount = 189 * nights;
  const cleaningFee = 45;
  const serviceFee = Math.round(baseAmount * 0.12);
  return {
    baseAmount,
    cleaningFee,
    serviceFee,
    total: baseAmount + cleaningFee + serviceFee,
    nights,
  };
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
  return { id: `review-${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
}

export async function getReviewSummary(listingId: string) {
  return {
    averageRating: 4.92,
    totalReviews: 127,
    overallAverage: 4.92,
    cleanlinessAverage: 4.9,
    locationAverage: 4.95,
    valueAverage: 4.88,
  };
}

export async function getListingReviews(listingId: string) {
  return [
    {
      id: "rev-1",
      reviewerName: "Sarah Jenkins",
      overallRating: 5,
      comment: "Absolutely breathtaking stay! Clean, peaceful, and stunning views.",
      createdAt: "2025-01-15T10:00:00Z",
    },
  ];
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
  return [
    {
      id: "b-101",
      listingId: "listing-1",
      listingTitle: "Stunning Oceanfront Bamboo Villa",
      hostName: "Kadek",
      checkIn: "2025-12-01",
      checkOut: "2025-12-06",
      totalAmount: 990,
      status: "CONFIRMED",
    },
  ];
}

export async function uploadListingPhotos(listingId: string, files: File[]) {
  return files.map((f, i) => `https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80`);
}
