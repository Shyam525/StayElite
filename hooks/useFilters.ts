"use client";

import { useEffect } from "react";
import { useQueryState } from "nuqs";
import { useFilterStore } from "@/store/filterStore";

export function useFilters() {
  const [city, setCityUrl] = useQueryState("city", { defaultValue: "" });
  const [category, setCategoryUrl] = useQueryState("category", { defaultValue: "" });
  const [checkIn, setCheckInUrl] = useQueryState("checkIn", { defaultValue: "" });
  const [checkOut, setCheckOutUrl] = useQueryState("checkOut", { defaultValue: "" });
  const [guests, setGuestsUrl] = useQueryState("guests", { defaultValue: "" });

  const filterStore = useFilterStore();

  // Sync URL state into Zustand store on initial load or URL change
  useEffect(() => {
    if (city !== filterStore.city) filterStore.setCity(city);
    if (category !== filterStore.category) filterStore.setCategory(category);
    if (checkIn !== filterStore.checkIn) filterStore.setDates(checkIn || null, checkOut || null);
    if (guests && Number(guests) > 0) filterStore.setGuests({ adults: Number(guests) });
  }, [city, category, checkIn, checkOut, guests]);

  const syncToUrl = (newCity?: string, newCategory?: string, newCheckIn?: string, newCheckOut?: string, newGuests?: number) => {
    void setCityUrl(newCity !== undefined ? newCity || null : filterStore.city || null);
    void setCategoryUrl(newCategory !== undefined ? newCategory || null : filterStore.category || null);
    void setCheckInUrl(newCheckIn !== undefined ? newCheckIn || null : filterStore.checkIn || null);
    void setCheckOutUrl(newCheckOut !== undefined ? newCheckOut || null : filterStore.checkOut || null);
    if (newGuests !== undefined) {
      void setGuestsUrl(newGuests > 1 ? String(newGuests) : null);
    }
  };

  const clearFilters = () => {
    filterStore.clearAll();
    void setCityUrl(null);
    void setCategoryUrl(null);
    void setCheckInUrl(null);
    void setCheckOutUrl(null);
    void setGuestsUrl(null);
  };

  return {
    ...filterStore,
    syncToUrl,
    clearFilters,
  };
}
