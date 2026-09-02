"use client";

import { useState } from "react";
import { DollarSign, Download, Edit3, X, Check, FileText } from "lucide-react";
import type { HostListing, HostBooking } from "@/types/host";

interface QuickActionsModalProps {
  listings: HostListing[];
  bookings: HostBooking[];
  activeListingToEdit: HostListing | null;
  onClose: () => void;
  onUpdateListingPrice: (listingId: string, newPrice: number) => void;
  onUpdateListingDetails: (listingId: string, details: { title: string; pricePerNight: number; bedrooms: number; maxGuests: number }) => void;
  onExportCSV: () => void;
}

export function QuickActionsModal({
  listings,
  activeListingToEdit,
  onClose,
  onUpdateListingPrice,
  onUpdateListingDetails,
  onExportCSV,
}: QuickActionsModalProps) {
  const [selectedId, setSelectedId] = useState<string>(
    activeListingToEdit?.id || listings[0]?.id || ""
  );

  const selectedListing = listings.find((l) => l.id === selectedId) || listings[0];

  const [title, setTitle] = useState(selectedListing?.title || "");
  const [price, setPrice] = useState(selectedListing?.pricePerNight || 300);
  const [bedrooms, setBedrooms] = useState(selectedListing?.bedrooms || 2);
  const [maxGuests, setMaxGuests] = useState(selectedListing?.maxGuests || 4);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleListingChange = (newId: string) => {
    setSelectedId(newId);
    const target = listings.find((l) => l.id === newId);
    if (target) {
      setTitle(target.title);
      setPrice(target.pricePerNight);
      setBedrooms(target.bedrooms);
      setMaxGuests(target.maxGuests);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListing) return;
    onUpdateListingDetails(selectedListing.id, {
      title,
      pricePerNight: Number(price),
      bedrooms: Number(bedrooms),
      maxGuests: Number(maxGuests),
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C]">
              <Edit3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Quick Actions & Pricing Editor</h3>
              <p className="text-xs text-slate-500">Update property rates & export reports</p>
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

        {savedSuccess ? (
          <div className="my-8 text-center py-6 animate-in zoom-in-95">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="mt-3 font-bold text-slate-900">Changes Saved Successfully!</h4>
            <p className="mt-1 text-xs text-slate-500">Your listing details and pricing have been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            {/* Select Listing */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Property
              </label>
              <select
                value={selectedId}
                onChange={(e) => handleListingChange(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-[#FF385C] focus:bg-white focus:outline-none"
              >
                {listings.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title} (${l.pricePerNight}/night)
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Listing Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#FF385C] focus:outline-none"
              />
            </div>

            {/* Price Per Night */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <DollarSign className="h-3 w-3 text-emerald-600" /> Price/Night ($)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#FF385C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#FF385C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Max Guests
                </label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-[#FF385C] focus:outline-none"
                />
              </div>
            </div>

            {/* CSV Export Bar */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Financial Reports</p>
                  <p className="text-[11px] text-slate-500">Download formatted earnings CSV</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onExportCSV}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
              >
                <Download className="h-3.5 w-3.5" /> CSV Report
              </button>
            </div>

            {/* Buttons */}
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
                className="rounded-full bg-[#FF385C] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e42d4d] transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
