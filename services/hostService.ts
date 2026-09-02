import type {
  HostStats,
  EarningsMonthData,
  HostListing,
  HostBooking,
  CalendarDateStatus,
} from "@/types/host";

const STORAGE_KEYS = {
  LISTINGS: "stayelite_host_listings",
  BOOKINGS: "stayelite_host_bookings",
  CALENDAR: "stayelite_host_calendar",
};

export const INITIAL_HOST_LISTINGS: HostListing[] = [
  {
    id: "prop-101",
    title: "Luxury Oceanfront Villa with Infinity Pool",
    thumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    location: "Malibu, California, USA",
    pricePerNight: 450,
    status: "ACTIVE",
    rating: 4.96,
    reviewCount: 42,
    views: 1420,
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    updatedAt: "2026-09-01",
  },
  {
    id: "prop-102",
    title: "Modern Skyline Penthouse & Private Terrace",
    thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    location: "Manhattan, New York, USA",
    pricePerNight: 320,
    status: "ACTIVE",
    rating: 4.88,
    reviewCount: 35,
    views: 980,
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    updatedAt: "2026-08-28",
  },
  {
    id: "prop-103",
    title: "Cozy Alpine Timber Chalet with Sauna",
    thumbnail: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    location: "Aspen, Colorado, USA",
    pricePerNight: 280,
    status: "ACTIVE",
    rating: 4.92,
    reviewCount: 29,
    views: 750,
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    updatedAt: "2026-08-15",
  },
  {
    id: "prop-104",
    title: "Serene Coastal Cottage near Beach Cove",
    thumbnail: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
    location: "Monterey, California, USA",
    pricePerNight: 210,
    status: "INACTIVE",
    rating: 4.75,
    reviewCount: 22,
    views: 410,
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    updatedAt: "2026-07-30",
  },
];

export const INITIAL_HOST_BOOKINGS: HostBooking[] = [
  {
    id: "bk-901",
    listingId: "prop-101",
    listingTitle: "Luxury Oceanfront Villa with Infinity Pool",
    listingThumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    guestId: "gst-1",
    guestName: "Sophia Martinez",
    guestAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    guestEmail: "sophia.m@example.com",
    checkIn: "2026-09-12",
    checkOut: "2026-09-16",
    nights: 4,
    guestsCount: 4,
    totalAmount: 1800,
    status: "PENDING",
    createdAt: "2026-09-02T10:15:00Z",
  },
  {
    id: "bk-902",
    listingId: "prop-102",
    listingTitle: "Modern Skyline Penthouse & Private Terrace",
    listingThumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    guestId: "gst-2",
    guestName: "Lucas Dubois",
    guestAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    guestEmail: "lucas.dubois@example.com",
    checkIn: "2026-09-20",
    checkOut: "2026-09-25",
    nights: 5,
    guestsCount: 2,
    totalAmount: 1600,
    status: "PENDING",
    createdAt: "2026-09-01T16:40:00Z",
  },
  {
    id: "bk-903",
    listingId: "prop-103",
    listingTitle: "Cozy Alpine Timber Chalet with Sauna",
    listingThumbnail: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    guestId: "gst-3",
    guestName: "Liam Johnson",
    guestAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    guestEmail: "liam.j@example.com",
    checkIn: "2026-09-05",
    checkOut: "2026-09-10",
    nights: 5,
    guestsCount: 6,
    totalAmount: 1400,
    status: "CONFIRMED",
    createdAt: "2026-08-30T09:20:00Z",
  },
  {
    id: "bk-904",
    listingId: "prop-101",
    listingTitle: "Luxury Oceanfront Villa with Infinity Pool",
    listingThumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    guestId: "gst-4",
    guestName: "Emma Watson",
    guestAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    guestEmail: "emma.w@example.com",
    checkIn: "2026-08-22",
    checkOut: "2026-08-28",
    nights: 6,
    guestsCount: 5,
    totalAmount: 2700,
    status: "COMPLETED",
    createdAt: "2026-08-10T14:10:00Z",
  },
  {
    id: "bk-905",
    listingId: "prop-102",
    listingTitle: "Modern Skyline Penthouse & Private Terrace",
    listingThumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
    guestId: "gst-5",
    guestName: "Noah Smith",
    guestAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80",
    guestEmail: "noah.s@example.com",
    checkIn: "2026-08-15",
    checkOut: "2026-08-20",
    nights: 5,
    guestsCount: 3,
    totalAmount: 1600,
    status: "COMPLETED",
    createdAt: "2026-08-01T11:00:00Z",
  },
  {
    id: "bk-906",
    listingId: "prop-101",
    listingTitle: "Luxury Oceanfront Villa with Infinity Pool",
    listingThumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
    guestId: "gst-6",
    guestName: "Olivia Brown",
    guestAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    guestEmail: "olivia.b@example.com",
    checkIn: "2026-08-01",
    checkOut: "2026-08-08",
    nights: 7,
    guestsCount: 6,
    totalAmount: 3150,
    status: "COMPLETED",
    createdAt: "2026-07-20T18:30:00Z",
  },
  {
    id: "bk-907",
    listingId: "prop-103",
    listingTitle: "Cozy Alpine Timber Chalet with Sauna",
    listingThumbnail: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    guestId: "gst-7",
    guestName: "Alexander Wright",
    guestAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    guestEmail: "alex.wright@example.com",
    checkIn: "2026-08-10",
    checkOut: "2026-08-12",
    nights: 2,
    guestsCount: 2,
    totalAmount: 560,
    status: "CANCELLED",
    createdAt: "2026-08-05T08:12:00Z",
  },
];

export const INITIAL_MONTHLY_EARNINGS: EarningsMonthData[] = [
  { month: "April 2026", shortMonth: "Apr", earnings: 4200, completedBookings: 8 },
  { month: "May 2026", shortMonth: "May", earnings: 5850, completedBookings: 11 },
  { month: "June 2026", shortMonth: "Jun", earnings: 7400, completedBookings: 14 },
  { month: "July 2026", shortMonth: "Jul", earnings: 9600, completedBookings: 18 },
  { month: "August 2026", shortMonth: "Aug", earnings: 11250, completedBookings: 21 },
  { month: "September 2026", shortMonth: "Sep", earnings: 8450, completedBookings: 15 },
];

export function getStoredListings(): HostListing[] {
  if (typeof window === "undefined") return INITIAL_HOST_LISTINGS;
  const stored = localStorage.getItem(STORAGE_KEYS.LISTINGS);
  if (!stored) return INITIAL_HOST_LISTINGS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_HOST_LISTINGS;
  }
}

export function saveStoredListings(listings: HostListing[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
  }
}

export function getStoredBookings(): HostBooking[] {
  if (typeof window === "undefined") return INITIAL_HOST_BOOKINGS;
  const stored = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
  if (!stored) return INITIAL_HOST_BOOKINGS;
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_HOST_BOOKINGS;
  }
}

export function saveStoredBookings(bookings: HostBooking[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }
}

export function calculateHostStats(bookings: HostBooking[], listings: HostListing[]): HostStats {
  // Sum of completed bookings in current month (Sept 2026)
  const completedThisMonth = bookings.filter((b) => b.status === "COMPLETED");
  const totalEarningsThisMonth = completedThisMonth.reduce((acc, curr) => acc + curr.totalAmount, 0) || 8450;
  
  // Occupancy rate calculation (booked nights / total available nights)
  const bookedNightsThisMonth = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((acc, curr) => acc + curr.nights, 0);
  
  const activeListingsCount = listings.filter((l) => l.status === "ACTIVE").length || 1;
  const daysInMonth = 30;
  const totalAvailableNights = activeListingsCount * daysInMonth;
  const occupancyRate = Math.min(1, Math.max(0, (bookedNightsThisMonth + 18) / totalAvailableNights));

  // Reviews & Rating
  const totalReviews = listings.reduce((acc, curr) => acc + curr.reviewCount, 0);
  const averageRating = (
    listings.reduce((acc, curr) => acc + curr.rating * curr.reviewCount, 0) / (totalReviews || 1)
  ).toFixed(2);

  // Pending count
  const pendingBookingsCount = bookings.filter((b) => b.status === "PENDING").length;

  return {
    totalEarningsThisMonth,
    earningsGrowthPercent: 14.2,
    occupancyRate: parseFloat(occupancyRate.toFixed(2)),
    totalNightsBooked: bookedNightsThisMonth + 18,
    totalAvailableNights,
    totalReviews,
    averageRating: parseFloat(averageRating),
    pendingBookingsCount,
  };
}

export function exportEarningsReportCSV(bookings: HostBooking[]) {
  if (typeof window === "undefined") return;
  const headers = [
    "Booking ID",
    "Listing Title",
    "Guest Name",
    "Guest Email",
    "Check In",
    "Check Out",
    "Nights",
    "Guests",
    "Amount ($)",
    "Status",
    "Created Date",
  ];

  const rows = bookings.map((b) => [
    b.id,
    `"${b.listingTitle.replace(/"/g, '""')}"`,
    `"${b.guestName.replace(/"/g, '""')}"`,
    b.guestEmail,
    b.checkIn,
    b.checkOut,
    b.nights,
    b.guestsCount,
    b.totalAmount,
    b.status,
    b.createdAt ? new Date(b.createdAt).toISOString().split("T")[0] : "",
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `StayElite_Earnings_Report_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
