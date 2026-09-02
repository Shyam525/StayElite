"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Plus,
  Trash2,
  Compass,
  FolderHeart,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import {
  useUserWishlist,
  useUserCollections,
  useDeleteCollection,
} from "@/hooks/useWishlist";
import { ListingCard } from "@/components/ListingCard";
import { CreateCollectionModal } from "@/components/modals/CreateCollectionModal";
import type { ListingDetail } from "@/services/listingService";
import type { WishlistItemResponse } from "@/types/wishlist";

export default function WishlistsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { data: wishlistItems, isLoading: wishlistLoading } = useUserWishlist();
  const { data: collections, isLoading: collectionsLoading } = useUserCollections();
  const deleteCollectionMutation = useDeleteCollection();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);

  // Protected route check: redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[500px] items-center justify-center text-sm text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#FF385C]" /> Loading wishlists...
      </div>
    );
  }

  const handleDeleteConfirm = () => {
    if (!collectionToDelete) return;
    deleteCollectionMutation.mutate(collectionToDelete, {
      onSuccess: () => {
        toast.success("Collection deleted");
        setCollectionToDelete(null);
      },
    });
  };

  // Convert WishlistItemResponse[] to ListingDetail[]
  const savedListings: ListingDetail[] = (wishlistItems || []).map((item) => ({
    id: item.listingId,
    title: item.title,
    description: "Saved stay from your wishlist.",
    propertyType: item.propertyType || "Entire stay",
    address: `${item.city}, ${item.country}`,
    city: item.city,
    country: item.country,
    basePricePerNight: Number(item.pricePerNight),
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    averageRating: item.averageRating,
    reviewCount: item.reviewCount,
    photoUrls: [item.primaryPhotoUrl],
    amenities: ["WiFi", "Kitchen"],
    createdAt: item.savedAt,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 fill-[#FF385C] text-[#FF385C]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Wishlists</h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Organize your saved homes into custom trips and collections.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF385C] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e42d4d] transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> New collection
        </button>
      </div>

      {/* SECTION 1: COLLECTIONS */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FolderHeart className="h-5 w-5 text-[#FF385C]" /> Your Collections
          </h2>
        </div>

        {collectionsLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
            <div className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
          </div>
        ) : collections && collections.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {collections.map((col) => (
              <div
                key={col.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                {/* 2x2 Photo Mosaic */}
                <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden aspect-[1.3] bg-slate-100 mb-3 border border-slate-200/60">
                  {col.previewPhotoUrls && col.previewPhotoUrls.length > 0 ? (
                    col.previewPhotoUrls.slice(0, 4).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`${col.name} photo ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ))
                  ) : (
                    <div className="col-span-2 flex h-full items-center justify-center text-slate-300">
                      <FolderHeart className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900 text-sm">{col.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{col.listingCount} listings</p>
                  </div>

                  {/* Delete collection button */}
                  <button
                    type="button"
                    onClick={() => setCollectionToDelete(col.id)}
                    className="rounded-full p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                    title="Delete collection"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center text-xs text-slate-500">
            Create collections to organize your saved homes by destination, style, or trip date.
          </div>
        )}
      </section>

      {/* SECTION 2: ALL SAVED LISTINGS */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            All saved homes ({savedListings.length})
          </h2>
        </div>

        {wishlistLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="aspect-[1.03] rounded-3xl bg-slate-200 animate-pulse" />
            <div className="aspect-[1.03] rounded-3xl bg-slate-200 animate-pulse" />
          </div>
        ) : savedListings.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            <AnimatePresence mode="popLayout">
              {savedListings.map((listing) => (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.25 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty state illustration & CTA */
          <div className="mt-8 text-center max-w-md mx-auto py-12 px-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50/50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-[#FF385C] mb-4">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              You haven't saved any homes yet
            </h3>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed">
              As you search, click the heart icon on any stay to save your favorite luxury villas, apartments, and chalets here.
            </p>
            <Link href="/">
              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
              >
                <Compass className="h-4 w-4 text-rose-400" /> Start Exploring Stays
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        savedListings={wishlistItems || []}
      />

      {/* Delete Confirmation Dialog */}
      {collectionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-bold text-slate-900">Delete collection?</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this collection? Saved listings inside will remain in your overall wishlist.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCollectionToDelete(null)}
                className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
