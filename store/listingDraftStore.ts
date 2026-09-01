import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PropertyType = "Apartment" | "House" | "Villa" | "Cabin" | "Studio" | "Loft" | "Treehouse" | "Boat";

export type ListingPhotoDraft = {
  id: string;
  name: string;
  preview: string;
};

export type ListingDraft = {
  propertyType: PropertyType | "";
  country: string;
  address: string;
  city: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos: ListingPhotoDraft[];
  title: string;
  description: string;
  basePricePerNight: number;
  cleaningFee: number;
};

export const initialListingDraft: ListingDraft = {
  propertyType: "",
  country: "United States",
  address: "",
  city: "",
  state: "",
  latitude: null,
  longitude: null,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  amenities: [],
  photos: [],
  title: "",
  description: "",
  basePricePerNight: 150,
  cleaningFee: 50,
};

type ListingDraftState = {
  draft: ListingDraft;
  updateDraft: (updates: Partial<ListingDraft>) => void;
  resetDraft: () => void;
};

export const useListingDraftStore = create<ListingDraftState>()(
  persist(
    (set) => ({
      draft: initialListingDraft,
      updateDraft: (updates) => set((state) => ({ draft: { ...state.draft, ...updates } })),
      resetDraft: () => set({ draft: initialListingDraft }),
    }),
    {
      name: "stayelite-listing-draft",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
