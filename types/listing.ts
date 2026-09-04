export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'VILLA'
  | 'CABIN'
  | 'STUDIO'
  | 'LOFT'
  | 'TREEHOUSE'
  | 'BOAT'
  | (string & {});

export interface ListingResponse {
  id: string;
  title: string;
  city: string;
  state?: string;
  country: string;
  propertyType: PropertyType | string;
  category: string;
  basePricePerNight: number;
  cleaningFee?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  averageRating: number;
  reviewCount: number;
  isGuestFavorite: boolean;
  isSuperhost: boolean;
  photos: string[];
  amenities: any[];
  latitude?: number;
  longitude?: number;
  availableDates?: string;
  isActive?: boolean;
  hostId?: string;
  hostName?: string;
  hostAvatarUrl?: string;
  // Compatibility fields
  pricePerNight?: number;
  primaryPhotoUrl?: string;
  photoUrls?: string[];
}

export interface ListingFilters {
  city?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType | string;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: any[];
  page?: number;
  size?: number;
  limit?: number;
}

export interface PaginatedListings {
  listings: ListingResponse[];
  total: number;
  page: number;
  totalPages: number;
  hasMore?: boolean;
  items?: ListingResponse[];
}

// Backward compatibility type aliases
export type ListingItem = ListingResponse;
export type ListingFilterParams = ListingFilters;
export type ListingPaginatedResponse = PaginatedListings;
