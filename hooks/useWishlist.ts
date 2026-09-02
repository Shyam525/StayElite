"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import {
  toggleWishlist,
  getUserWishlist,
  getWishlistStatus,
  createCollection,
  getUserCollections,
  deleteCollection,
  addToCollection,
  removeFromCollection,
} from "@/services/wishlistService";
import type { WishlistToggleResponse } from "@/types/wishlist";

export function useUserWishlist() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getUserWishlist,
    enabled: isAuthenticated,
  });
}

export function useWishlistStatus(listingIds: string[]) {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["wishlistStatus", listingIds],
    queryFn: () => getWishlistStatus(listingIds),
    enabled: isAuthenticated && Boolean(listingIds && listingIds.length > 0),
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation<WishlistToggleResponse, Error, string, { previousStatuses: any }>({
    mutationFn: (listingId: string) => toggleWishlist(listingId),

    onMutate: async (listingId: string) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["wishlistStatus"] });

      // Save previous state for rollback
      const previousStatuses = queryClient.getQueriesData<Record<string, boolean>>({
        queryKey: ["wishlistStatus"],
      });

      // Optimistically update cached status
      queryClient.setQueriesData<Record<string, boolean>>(
        { queryKey: ["wishlistStatus"] },
        (old) => {
          if (!old) return { [listingId]: true };
          return {
            ...old,
            [listingId]: !old[listingId],
          };
        }
      );

      return { previousStatuses };
    },

    onError: (_err, _listingId, context) => {
      // Rollback on error
      if (context?.previousStatuses && Array.isArray(context.previousStatuses)) {
        context.previousStatuses.forEach((entry: any) => {
          queryClient.setQueryData(entry[0], entry[1]);
        });
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      void queryClient.invalidateQueries({ queryKey: ["wishlistStatus"] });
      void queryClient.invalidateQueries({ queryKey: ["wishlistCollections"] });
    },
  });
}

export function useUserCollections() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ["wishlistCollections"],
    queryFn: getUserCollections,
    enabled: isAuthenticated,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createCollection(name),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlistCollections"] });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlistCollections"] });
    },
  });
}

export function useAddToCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, listingId }: { collectionId: string; listingId: string }) =>
      addToCollection(collectionId, listingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlistCollections"] });
    },
  });
}

export function useRemoveFromCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, listingId }: { collectionId: string; listingId: string }) =>
      removeFromCollection(collectionId, listingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlistCollections"] });
    },
  });
}
