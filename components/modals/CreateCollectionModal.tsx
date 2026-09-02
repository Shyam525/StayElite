"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Check, FolderPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useCreateCollection, useAddToCollection } from "@/hooks/useWishlist";
import type { WishlistItemResponse } from "@/types/wishlist";

const schema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
});

type FormData = z.infer<typeof schema>;

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedListings?: WishlistItemResponse[];
}

export function CreateCollectionModal({
  isOpen,
  onClose,
  savedListings = [],
}: CreateCollectionModalProps) {
  const [selectedListingIds, setSelectedListingIds] = useState<Set<string>>(new Set());
  const createCollectionMutation = useCreateCollection();
  const addToCollectionMutation = useAddToCollection();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" },
  });

  const nameValue = watch("name", "");

  if (!isOpen) return null;

  const toggleListingSelect = (id: string) => {
    const updated = new Set(selectedListingIds);
    if (updated.has(id)) updated.delete(id);
    else updated.add(id);
    setSelectedListingIds(updated);
  };

  const onSubmit = (data: FormData) => {
    createCollectionMutation.mutate(data.name.trim(), {
      onSuccess: async (created) => {
        // Add selected listings to the newly created collection
        if (selectedListingIds.size > 0) {
          for (const listingId of Array.from(selectedListingIds)) {
            await addToCollectionMutation.mutateAsync({
              collectionId: created.id,
              listingId,
            });
          }
        }

        toast.success(`Collection "${created.name}" created!`, {
          icon: "📁",
          style: { borderRadius: "16px", background: "#1e293b", color: "#fff", fontSize: "13px" },
        });

        reset();
        setSelectedListingIds(new Set());
        onClose();
      },
      onError: () => {
        toast.error("Failed to create collection. Please try again.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C]">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Name this collection</h3>
              <p className="text-xs text-slate-500">Organize your saved stays into custom lists</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Collection Name
            </label>
            <input
              type="text"
              {...register("name")}
              maxLength={100}
              placeholder="e.g. Beach Trips, Summer 2025, Chalets"
              className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#FF385C] focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between">
              {errors.name ? (
                <span className="text-[11px] font-medium text-rose-600">
                  {errors.name.message}
                </span>
              ) : (
                <span />
              )}
              <span className="text-[11px] font-medium text-slate-400">
                {nameValue.length}/100
              </span>
            </div>
          </div>

          {/* Selectable saved listings grid */}
          {savedListings.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-700 mb-2">
                Add listings to start <span className="text-slate-400 font-normal">(optional)</span>
              </p>
              <div className="max-h-48 overflow-y-auto grid grid-cols-3 gap-2.5 p-1">
                {savedListings.map((item) => {
                  const isSelected = selectedListingIds.has(item.listingId);
                  return (
                    <div
                      key={item.listingId}
                      onClick={() => toggleListingSelect(item.listingId)}
                      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border transition ${
                        isSelected
                          ? "border-[#FF385C] ring-2 ring-[#FF385C]/30"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={item.primaryPhotoUrl || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80"}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-900/20" />
                      <div
                        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-white ${
                          isSelected ? "bg-[#FF385C]" : "bg-black/40"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createCollectionMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FF385C] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e42d4d] transition disabled:opacity-50"
            >
              {createCollectionMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
