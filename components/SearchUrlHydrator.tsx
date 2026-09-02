"use client";

import { useEffect, useRef } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useSearchFilterStore } from "@/store/searchFilterStore";

const parsers = { location: parseAsString, checkIn: parseAsString, checkOut: parseAsString, guests: parseAsInteger, category: parseAsString, min: parseAsInteger, max: parseAsInteger, types: parseAsString, bedrooms: parseAsInteger, bathrooms: parseAsInteger, amenities: parseAsString, swLat: parseAsString, swLng: parseAsString, neLat: parseAsString, neLng: parseAsString };

export function SearchUrlHydrator() {
  const [urlState] = useQueryStates(parsers);
  const setFilters = useSearchFilterStore((state) => state.setFilters);
  const applied = useRef("");
  useEffect(() => {
    const signature = JSON.stringify(urlState);
    if (applied.current === signature) return;
    applied.current = signature;
    const bounds = urlState.swLat && urlState.swLng && urlState.neLat && urlState.neLng ? { swLat: Number(urlState.swLat), swLng: Number(urlState.swLng), neLat: Number(urlState.neLat), neLng: Number(urlState.neLng) } : null;
    setFilters({ location: urlState.location || "", checkIn: urlState.checkIn || "", checkOut: urlState.checkOut || "", category: urlState.category || "", minPrice: urlState.min || 0, maxPrice: urlState.max || 1000, propertyTypes: urlState.types ? urlState.types.split(",") : [], bedrooms: urlState.bedrooms || 0, bathrooms: urlState.bathrooms || 0, amenities: urlState.amenities ? urlState.amenities.split(",") : [], guests: { adults: Math.max(1, urlState.guests || 1), children: 0, infants: 0 }, bounds });
  }, [setFilters, urlState]);
  return null;
}
