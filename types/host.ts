export interface HostStats {
  totalEarningsThisMonth: number;
  earningsGrowthPercent: number;
  occupancyRate: number; // 0 to 1, e.g. 0.84 for 84%
  totalNightsBooked: number;
  totalAvailableNights: number;
  totalReviews: number;
  averageRating: number;
  pendingBookingsCount: number;
}

export interface EarningsMonthData {
  month: string;
  shortMonth: string;
  earnings: number;
  completedBookings: number;
}

export interface HostListing {
  id: string;
  title: string;
  thumbnail: string;
  location: string;
  pricePerNight: number;
  status: "ACTIVE" | "INACTIVE";
  rating: number;
  reviewCount: number;
  views: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  updatedAt: string;
}

export interface HostBooking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingThumbnail: string;
  guestId: string;
  guestName: string;
  guestAvatar: string;
  guestEmail: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  nights: number;
  guestsCount: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
}

export interface CalendarDateStatus {
  date: string; // YYYY-MM-DD
  status: "available" | "booked" | "blocked";
  guestName?: string;
  price?: number;
}
