export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'guest' | 'host' | 'admin';
  createdAt: Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  hostId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SearchFilters {
  location?: string;
  checkInDate?: Date;
  checkOutDate?: Date;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  sortBy?: 'price' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
