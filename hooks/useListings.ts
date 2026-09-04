"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getListings } from "@/services/listingService";
import { MOCK_LISTINGS } from "@/lib/mockData";
import type { ListingFilters } from "@/types/listing";

export { MOCK_LISTINGS };

export function useListings(customFilters?: ListingFilters) {
  const searchParams = useSearchParams();

  // Read ALL filters from URL params or custom overrides
  const filters: ListingFilters = {
    city: customFilters?.city ?? (searchParams.get("city") || undefined),
    checkIn: customFilters?.checkIn ?? (searchParams.get("checkIn") || undefined),
    checkOut: customFilters?.checkOut ?? (searchParams.get("checkOut") || undefined),
    guests:
      customFilters?.guests ??
      (searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined),
    category: customFilters?.category ?? (searchParams.get("category") || undefined),
    minPrice:
      customFilters?.minPrice ??
      (searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined),
    maxPrice:
      customFilters?.maxPrice ??
      (searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined),
    propertyType:
      customFilters?.propertyType ??
      ((searchParams.get("propertyType") as any) || undefined),
    bedrooms:
      customFilters?.bedrooms ??
      (searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined),
    size: customFilters?.size ?? 20,
  };

  // Remove undefined values to avoid unnecessary refetches
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== undefined)
  );

  const query = useInfiniteQuery({
    queryKey: ["listings", cleanFilters],
    queryFn: ({ pageParam = 1 }) =>
      getListings({ ...cleanFilters, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Flatten all pages into one array
  const listings = query.data?.pages.flatMap((p) => p.listings) ?? [];
  const total = query.data?.pages[0]?.total ?? 0;

  return {
    data: query.data,
    listings,
    total,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    isFetchingMore: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isError: query.isError,
    refetch: query.refetch,
    filters: cleanFilters,
  };
}
