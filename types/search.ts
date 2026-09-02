export type SearchTab = "stays" | "experiences" | "online";

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface DestinationOption {
  city: string;
  country: string;
  flag: string;
  label: string;
  photoUrl: string;
}

export interface FilterState {
  city: string;
  checkIn: string | null;
  checkOut: string | null;
  guests: GuestCounts;
  category: string;
  minPrice: number;
  maxPrice: number;
  typeOfPlace: "any" | "room" | "entire";
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  propertyType: string[];
  amenities: string[];
  instantBook: boolean;
  selfCheckIn: boolean;
  freeCancellation: boolean;
  accessibility: string[];
  displayTotalPrice: boolean;
}
