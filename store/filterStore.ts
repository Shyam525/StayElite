import { create } from "zustand";
import type { FilterState, GuestCounts } from "@/types/search";

interface FilterStoreState extends FilterState {
  setCity: (city: string) => void;
  setDates: (checkIn: string | null, checkOut: string | null) => void;
  setGuests: (guests: Partial<GuestCounts>) => void;
  setCategory: (category: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setTypeOfPlace: (type: "any" | "room" | "entire") => void;
  setBedrooms: (count: number | null) => void;
  setBeds: (count: number | null) => void;
  setBathrooms: (count: number | null) => void;
  togglePropertyType: (type: string) => void;
  toggleAmenity: (amenity: string) => void;
  toggleBookingOption: (key: "instantBook" | "selfCheckIn" | "freeCancellation") => void;
  toggleAccessibilityOption: (item: string) => void;
  toggleDisplayTotalPrice: () => void;
  clearAll: () => void;
}

const initialFilterState: FilterState = {
  city: "",
  checkIn: null,
  checkOut: null,
  guests: { adults: 1, children: 0, infants: 0, pets: 0 },
  category: "",
  minPrice: 0,
  maxPrice: 1000,
  typeOfPlace: "any",
  bedrooms: null,
  beds: null,
  bathrooms: null,
  propertyType: [],
  amenities: [],
  instantBook: false,
  selfCheckIn: false,
  freeCancellation: false,
  accessibility: [],
  displayTotalPrice: false,
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  ...initialFilterState,

  setCity: (city) => set({ city }),
  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuests: (update) =>
    set((state) => ({ guests: { ...state.guests, ...update } })),
  setCategory: (category) =>
    set((state) => ({ category: state.category === category ? "" : category })),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setTypeOfPlace: (typeOfPlace) => set({ typeOfPlace }),
  setBedrooms: (bedrooms) => set({ bedrooms }),
  setBeds: (beds) => set({ beds }),
  setBathrooms: (bathrooms) => set({ bathrooms }),
  togglePropertyType: (type) =>
    set((state) => {
      const exists = state.propertyType.includes(type);
      return {
        propertyType: exists
          ? state.propertyType.filter((t) => t !== type)
          : [...state.propertyType, type],
      };
    }),
  toggleAmenity: (amenity) =>
    set((state) => {
      const exists = state.amenities.includes(amenity);
      return {
        amenities: exists
          ? state.amenities.filter((a) => a !== amenity)
          : [...state.amenities, amenity],
      };
    }),
  toggleBookingOption: (key) =>
    set((state) => ({ [key]: !state[key] })),
  toggleAccessibilityOption: (item) =>
    set((state) => {
      const exists = state.accessibility.includes(item);
      return {
        accessibility: exists
          ? state.accessibility.filter((i) => i !== item)
          : [...state.accessibility, item],
      };
    }),
  toggleDisplayTotalPrice: () =>
    set((state) => ({ displayTotalPrice: !state.displayTotalPrice })),
  clearAll: () => set({ ...initialFilterState }),
}));
