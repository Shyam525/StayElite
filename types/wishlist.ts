export interface WishlistToggleResponse {
  saved: boolean;
  message: string;
  listingId: string;
}

export interface WishlistItemResponse {
  listingId: string;
  title: string;
  city: string;
  country: string;
  primaryPhotoUrl: string;
  pricePerNight: number;
  averageRating: number;
  reviewCount: number;
  propertyType: string;
  savedAt: string;
}

export interface WishlistCollectionRequest {
  name: string;
}

export interface WishlistCollectionResponse {
  id: string;
  name: string;
  listingCount: number;
  previewPhotoUrls: string[];
  createdAt: string;
}
