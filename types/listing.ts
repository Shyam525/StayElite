export interface ListingItem {
  id: string;
  title: string;
  description?: string;
  city: string;
  country: string;
  primaryPhotoUrl?: string;
  photoUrls: string[];
  pricePerNight: number;
  averageRating?: number;
  reviewCount?: number;
  propertyType: string;
  isSaved?: boolean;
  isGuestFavorite?: boolean;
  availableDates?: string;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  maxGuests?: number;
  amenities?: string[];
  hostName?: string;
  isSuperhost?: boolean;
  createdAt?: string;
}

export interface ListingFilterParams {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string;
  page?: number;
  limit?: number;
}

export interface ListingPaginatedResponse {
  items: ListingItem[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
