"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Home,
  Building,
  Castle,
  Ship,
  TreePine,
  Wifi,
  Utensils,
  Car,
  Tv,
  Check,
  RotateCcw,
} from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface FiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalResultsCount?: number;
}

const PROPERTY_TYPES = [
  { id: "house", label: "House", icon: Home },
  { id: "apartment", label: "Apartment", icon: Building },
  { id: "villa", label: "Villa", icon: Castle },
  { id: "cabin", label: "Cabin", icon: TreePine },
  { id: "boat", label: "Boat", icon: Ship },
  { id: "treehouse", label: "Treehouse", icon: TreePine },
];

const AMENITY_ITEMS = [
  { id: "wifi", label: "Wifi", icon: Wifi },
  { id: "kitchen", label: "Kitchen", icon: Utensils },
  { id: "parking", label: "Free parking", icon: Car },
  { id: "pool", label: "Pool", icon: Home },
  { id: "tv", label: "TV", icon: Tv },
  { id: "ac", label: "Air conditioning", icon: Home },
];

export function FiltersDrawer({ isOpen, onClose, totalResultsCount = 42 }: FiltersDrawerProps) {
  const {
    minPrice,
    maxPrice,
    typeOfPlace,
    bedrooms,
    beds,
    bathrooms,
    propertyType,
    amenities,
    instantBook,
    selfCheckIn,
    freeCancellation,
    setPriceRange,
    setTypeOfPlace,
    setBedrooms,
    setBeds,
    setBathrooms,
    togglePropertyType,
    toggleAmenity,
    toggleBookingOption,
    clearFilters,
  } = useFilters();

  const [minInput, setMinInput] = useState<number>(minPrice || 0);
  const [maxInput, setMaxInput] = useState<number>(maxPrice || 1000);

  if (!isOpen) return null;

  const handleApply = () => {
    setPriceRange(minInput, maxInput);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-2xs p-0 sm:p-4">
        {/* Modal Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative flex h-[90vh] sm:h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl sm:rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-bold text-[#222222]">Filters</h2>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-[#717171] hover:underline"
            >
              Clear all
            </button>
          </div>

          {/* SCROLLABLE BODY CONTENT */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 divide-y divide-slate-100">
            {/* 1. TYPE OF PLACE */}
            <section className="pt-2">
              <h3 className="text-base font-bold text-[#222222] mb-1">Type of place</h3>
              <p className="text-xs text-[#717171] mb-4">Search rooms, entire homes, or any type</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "any", label: "Any type" },
                  { id: "room", label: "Room" },
                  { id: "entire", label: "Entire home" },
                ].map((item) => {
                  const isSelected = typeOfPlace === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setTypeOfPlace(item.id as any)}
                      className={`flex h-12 items-center justify-center rounded-2xl border text-xs font-bold transition ${
                        isSelected
                          ? "border-[#222222] bg-[#222222] text-white"
                          : "border-slate-200 bg-white text-[#222222] hover:border-slate-400"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 2. PRICE RANGE */}
            <section className="pt-8">
              <h3 className="text-base font-bold text-[#222222] mb-1">Price range</h3>
              <p className="text-xs text-[#717171] mb-4">Nightly prices before taxes</p>

              {/* Mini Histogram Visual */}
              <div className="flex items-end justify-between gap-1 h-16 px-4 mb-4">
                {[20, 35, 45, 70, 90, 100, 85, 60, 40, 25, 15, 10].map((val, idx) => (
                  <div
                    key={idx}
                    className="w-full rounded-t-sm bg-rose-200"
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>

              {/* Min and Max Input Boxes */}
              <div className="flex items-center gap-4">
                <div className="flex-1 rounded-2xl border border-slate-200 p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                    Minimum
                  </label>
                  <div className="flex items-center text-xs font-bold text-[#222222]">
                    <span>$</span>
                    <input
                      type="number"
                      value={minInput}
                      onChange={(e) => setMinInput(Number(e.target.value))}
                      className="w-full bg-transparent outline-none ml-1 font-bold text-xs"
                    />
                  </div>
                </div>
                <span className="text-slate-400 font-semibold">–</span>
                <div className="flex-1 rounded-2xl border border-slate-200 p-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#717171]">
                    Maximum
                  </label>
                  <div className="flex items-center text-xs font-bold text-[#222222]">
                    <span>$</span>
                    <input
                      type="number"
                      value={maxInput}
                      onChange={(e) => setMaxInput(Number(e.target.value))}
                      className="w-full bg-transparent outline-none ml-1 font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 3. ROOMS & BEDS */}
            <section className="pt-8">
              <h3 className="text-base font-bold text-[#222222] mb-4">Rooms and beds</h3>

              {/* Bedrooms Selector */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-[#222222] mb-2">Bedrooms</p>
                <div className="flex flex-wrap gap-2">
                  {[null, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const isSelected = bedrooms === num;
                    return (
                      <button
                        type="button"
                        key={num ?? "any"}
                        onClick={() => setBedrooms(num)}
                        className={`flex h-9 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-semibold transition ${
                          isSelected
                            ? "border-[#222222] bg-[#222222] text-white"
                            : "border-slate-200 text-[#222222] hover:border-slate-400"
                        }`}
                      >
                        {num === null ? "Any" : num === 8 ? "8+" : num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Beds Selector */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-[#222222] mb-2">Beds</p>
                <div className="flex flex-wrap gap-2">
                  {[null, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                    const isSelected = beds === num;
                    return (
                      <button
                        type="button"
                        key={num ?? "any"}
                        onClick={() => setBeds(num)}
                        className={`flex h-9 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-semibold transition ${
                          isSelected
                            ? "border-[#222222] bg-[#222222] text-white"
                            : "border-slate-200 text-[#222222] hover:border-slate-400"
                        }`}
                      >
                        {num === null ? "Any" : num === 8 ? "8+" : num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bathrooms Selector */}
              <div>
                <p className="text-xs font-semibold text-[#222222] mb-2">Bathrooms</p>
                <div className="flex flex-wrap gap-2">
                  {[null, 1, 1.5, 2, 3, 4, 5].map((num) => {
                    const isSelected = bathrooms === num;
                    return (
                      <button
                        type="button"
                        key={num ?? "any"}
                        onClick={() => setBathrooms(num)}
                        className={`flex h-9 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-semibold transition ${
                          isSelected
                            ? "border-[#222222] bg-[#222222] text-white"
                            : "border-slate-200 text-[#222222] hover:border-slate-400"
                        }`}
                      >
                        {num === null ? "Any" : num === 5 ? "5+" : num}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4. AMENITIES */}
            <section className="pt-8">
              <h3 className="text-base font-bold text-[#222222] mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {AMENITY_ITEMS.map((item) => {
                  const isSelected = amenities.includes(item.id);
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => toggleAmenity(item.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-xs font-semibold transition ${
                        isSelected
                          ? "border-[#222222] bg-[#222222] text-white"
                          : "border-slate-200 text-[#222222] hover:border-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 5. PROPERTY TYPE */}
            <section className="pt-8">
              <h3 className="text-base font-bold text-[#222222] mb-4">Property type</h3>
              <div className="grid grid-cols-3 gap-3">
                {PROPERTY_TYPES.map((prop) => {
                  const isSelected = propertyType.includes(prop.id);
                  const Icon = prop.icon;
                  return (
                    <button
                      type="button"
                      key={prop.id}
                      onClick={() => togglePropertyType(prop.id)}
                      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-xs font-bold transition ${
                        isSelected
                          ? "border-[#222222] bg-[#222222] text-white"
                          : "border-slate-200 text-[#222222] hover:border-slate-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{prop.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 6. BOOKING OPTIONS */}
            <section className="pt-8">
              <h3 className="text-base font-bold text-[#222222] mb-4">Booking options</h3>
              <div className="space-y-4">
                {[
                  { key: "instantBook", label: "Instant Book", desc: "Book without waiting for host approval" },
                  { key: "selfCheckIn", label: "Self check-in", desc: "Easy access with keyless lock or keypad" },
                  { key: "freeCancellation", label: "Free cancellation", desc: "Full refund up to 48h before check-in" },
                ].map((opt) => {
                  const isChecked = (useFilters() as any)[opt.key];
                  return (
                    <div
                      key={opt.key}
                      onClick={() => toggleBookingOption(opt.key as any)}
                      className="flex items-center justify-between cursor-pointer py-1"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#222222]">{opt.label}</p>
                        <p className="text-[11px] text-[#717171]">{opt.desc}</p>
                      </div>
                      <div
                        className={`h-6 w-11 rounded-full p-0.5 transition ${
                          isChecked ? "bg-slate-900" : "bg-slate-200"
                        }`}
                      >
                        <div
                          className={`h-5 w-5 rounded-full bg-white shadow-xs transition transform ${
                            isChecked ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* STICKY FOOTER */}
          <div className="flex h-20 items-center justify-between border-t border-slate-200 bg-white px-6 shrink-0">
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-bold text-[#222222] underline"
            >
              Clear all
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="rounded-full bg-[#FF385C] px-7 py-3 text-xs font-bold text-white shadow-md hover:bg-[#e42d4d] transition"
            >
              Show {totalResultsCount}+ homes →
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
