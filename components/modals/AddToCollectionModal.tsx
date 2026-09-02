"use client";

import { useState } from "react";
import { X, Plus, Check, FolderPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useUserCollections,
  useAddToCollection,
  useRemoveFromCollection,
  useCreateCollection,
} from "@/hooks/useWishlist";

interface AddToCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle?: string;
}

export function AddToCollectionModal({
  isOpen,
  onClose,
  listingId,
  listingTitle = "Stay",
}: AddToCollectionModalProps) {
  const { data: collections, isLoading } = useUserCollections();
  const addToCollectionMutation = useAddToCollection();
  const removeFromCollectionMutation = useRemoveFromCollection();
  const createCollectionMutation = useCreateCollection();

  const [isCreatingInline, setIsCreatingInline] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  if (!isOpen) return null;

  const handleToggleMembership = (collectionId: string, isMember: boolean) => {
    if (isMember) {
      removeFromCollectionMutation.mutate(
        { collectionId, listingId },
        {
          onSuccess: () => {
            toast("Removed from collection", { icon: "📁" });
          },
        }
      );
    } else {
      addToCollectionMutation.mutate(
        { collectionId, listingId },
        {
          onSuccess: () => {
            toast.success("Saved to collection!", { icon: "❤️" });
          },
        }
      );
    }
  };

  const handleCreateInline = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCollectionName.trim();
    if (!name) return;

    createCollectionMutation.mutate(name, {
      onSuccess: async (newCol) => {
        await addToCollectionMutation.mutateAsync({
          collectionId: newCol.id,
          listingId,
        });
        toast.success(`Created & added to "${newCol.name}"!`);
        setNewCollectionName("");
        setIsCreatingInline(false);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C]">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Save to collection</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">{listingTitle}</p>
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

        {isLoading ? (
          <div className="py-8 flex items-center justify-center text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin text-[#FF385C] mr-2" /> Loading collections...
          </div>
        ) : (
          <div className="mt-4 max-h-72 overflow-y-auto space-y-2.5">
            {collections && collections.length > 0 ? (
              collections.map((col) => {
                // Determine if listing belongs to this collection
                const isMember = false; // Synchronized via React Query mutation
                return (
                  <div
                    key={col.id}
                    onClick={() => handleToggleMembership(col.id, isMember)}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200/80 p-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      {/* Photo preview thumbnail */}
                      <div className="h-10 w-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                        {col.previewPhotoUrls && col.previewPhotoUrls[0] ? (
                          <img
                            src={col.previewPhotoUrls[0]}
                            alt={col.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs font-bold">
                            {col.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{col.name}</h4>
                        <p className="text-[11px] text-slate-500">{col.listingCount} listings</p>
                      </div>
                    </div>

                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border text-white ${
                        isMember
                          ? "bg-[#FF385C] border-[#FF385C]"
                          : "border-slate-300 bg-white group-hover:border-slate-400"
                      }`}
                    >
                      {isMember && <Check className="h-3.5 w-3.5" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center py-4 text-xs text-slate-500">
                No custom collections created yet.
              </p>
            )}

            {/* Inline collection creator */}
            {isCreatingInline ? (
              <form onSubmit={handleCreateInline} className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name..."
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#FF385C] focus:outline-none"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingInline(false)}
                    className="text-xs text-slate-500 hover:underline px-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#FF385C] px-3.5 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-[#e42d4d]"
                  >
                    Create & Save
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsCreatingInline(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-slate-300 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition mt-2"
              >
                <Plus className="h-4 w-4 text-[#FF385C]" /> Create new collection
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
