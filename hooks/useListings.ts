"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { ListingItem, ListingFilterParams, ListingPaginatedResponse } from "@/types/listing";

export const MOCK_LISTINGS: ListingItem[] = [
  {
    id: "prop-101",
    title: "Minimalist Oceanfront Villa",
    city: "Bali",
    country: "Indonesia",
    propertyType: "Entire villa",
    pricePerNight: 480,
    averageRating: 4.96,
    reviewCount: 128,
    isGuestFavorite: true,
    availableDates: "Dec 3–8",
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    maxGuests: 8,
    isSuperhost: true,
    hostName: "Kadek",
    photoUrls: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-102",
    title: "Haussmannian Luxury Apartment with Eiffel View",
    city: "Paris",
    country: "France",
    propertyType: "Entire apartment",
    pricePerNight: 650,
    averageRating: 4.92,
    reviewCount: 84,
    isGuestFavorite: true,
    availableDates: "Dec 10–15",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    isSuperhost: true,
    hostName: "Charlotte",
    photoUrls: [
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-103",
    title: "Traditional Wooden Ryokan with Onsen Bath",
    city: "Kyoto",
    country: "Japan",
    propertyType: "Entire ryokan",
    pricePerNight: 390,
    averageRating: 4.98,
    reviewCount: 162,
    isGuestFavorite: true,
    availableDates: "Dec 5–10",
    bedrooms: 3,
    beds: 5,
    bathrooms: 2,
    maxGuests: 6,
    isSuperhost: true,
    hostName: "Kenji",
    photoUrls: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-104",
    title: "Modern Glass Penthouse in Soho",
    city: "New York",
    country: "United States",
    propertyType: "Entire penthouse",
    pricePerNight: 890,
    averageRating: 4.89,
    reviewCount: 42,
    isGuestFavorite: false,
    availableDates: "Dec 12–17",
    bedrooms: 3,
    beds: 3,
    bathrooms: 3.5,
    maxGuests: 6,
    hostName: "Julian",
    photoUrls: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-105",
    title: "Cliffside Caldera Villa with Private Infinity Pool",
    city: "Santorini",
    country: "Greece",
    propertyType: "Entire villa",
    pricePerNight: 720,
    averageRating: 4.99,
    reviewCount: 215,
    isGuestFavorite: true,
    availableDates: "Dec 2–7",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    isSuperhost: true,
    hostName: "Eleni",
    photoUrls: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-106",
    title: "Overwater Bungalow with Glass Floor",
    city: "Maldives",
    country: "Maldives",
    propertyType: "Overwater bungalow",
    pricePerNight: 1250,
    averageRating: 4.97,
    reviewCount: 96,
    isGuestFavorite: true,
    availableDates: "Dec 15–20",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    isSuperhost: true,
    hostName: "Aaris",
    photoUrls: [
      "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-107",
    title: "Alpine Timber Chalet with Outdoor Sauna",
    city: "Zermatt",
    country: "Switzerland",
    propertyType: "Entire chalet",
    pricePerNight: 820,
    averageRating: 4.94,
    reviewCount: 78,
    isGuestFavorite: true,
    availableDates: "Dec 8–14",
    bedrooms: 4,
    beds: 6,
    bathrooms: 4,
    maxGuests: 8,
    isSuperhost: true,
    hostName: "Beat",
    photoUrls: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-108",
    title: "Secluded Tuscan Stone Farmhouse & Vineyard",
    city: "Florence",
    country: "Italy",
    propertyType: "Entire villa",
    pricePerNight: 540,
    averageRating: 4.91,
    reviewCount: 110,
    isGuestFavorite: true,
    availableDates: "Dec 4–9",
    bedrooms: 5,
    beds: 5,
    bathrooms: 4,
    maxGuests: 10,
    isSuperhost: true,
    hostName: "Matteo",
    photoUrls: [
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-109",
    title: "Contemporary Desert Glass House",
    city: "Joshua Tree",
    country: "United States",
    propertyType: "Entire home",
    pricePerNight: 410,
    averageRating: 4.88,
    reviewCount: 65,
    isGuestFavorite: false,
    availableDates: "Dec 1–6",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    hostName: "Sierra",
    photoUrls: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "prop-110",
    title: "Panoramic Beachfront Penthouse with Rooftop Hot Tub",
    city: "Mumbai",
    country: "India",
    propertyType: "Entire penthouse",
    pricePerNight: 350,
    averageRating: 4.95,
    reviewCount: 88,
    isGuestFavorite: true,
    availableDates: "Dec 7–12",
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    isSuperhost: true,
    hostName: "Rohan",
    photoUrls: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

export function useListings(filters: ListingFilterParams = {}) {
  return useInfiniteQuery<ListingPaginatedResponse>({
    queryKey: ["listings", filters],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const params = new URLSearchParams();
        params.set("page", String(pageParam));
        params.set("limit", "12");

        if (filters.city) params.set("city", filters.city);
        if (filters.category) params.set("category", filters.category);
        if (filters.checkIn) params.set("checkIn", filters.checkIn);
        if (filters.checkOut) params.set("checkOut", filters.checkOut);
        if (filters.guests) params.set("guests", String(filters.guests));
        if (filters.minPrice) params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice) params.set("maxPrice", String(filters.maxPrice));
        if (filters.bedrooms) params.set("bedrooms", String(filters.bedrooms));
        if (filters.propertyType) params.set("propertyType", filters.propertyType);

        const res = await api.get(`/listings?${params.toString()}`);
        const data = res.data?.data || res.data;

        if (Array.isArray(data)) {
          return {
            items: data,
            page: Number(pageParam),
            limit: 12,
            total: data.length,
            hasMore: false,
          };
        }

        if (data && Array.isArray(data.items)) {
          return data as ListingPaginatedResponse;
        }

        throw new Error("Invalid API response format");
      } catch (err) {
        // Fallback to mock items if backend is unreachable or returning empty
        let items = [...MOCK_LISTINGS];

        if (filters.city) {
          items = items.filter((item) =>
            item.city.toLowerCase().includes(filters.city!.toLowerCase())
          );
        }

        if (filters.minPrice || filters.maxPrice) {
          const min = filters.minPrice || 0;
          const max = filters.maxPrice || 10000;
          items = items.filter(
            (item) => item.pricePerNight >= min && item.pricePerNight <= max
          );
        }

        const pageSize = 8;
        const pageNum = Number(pageParam);
        const startIndex = (pageNum - 1) * pageSize;
        const pageItems = items.slice(startIndex, startIndex + pageSize);
        const hasMore = startIndex + pageSize < items.length;

        return {
          items: pageItems,
          page: pageNum,
          limit: pageSize,
          total: items.length,
          hasMore,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });
}
