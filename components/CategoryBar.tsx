"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

export interface CategoryOption {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES: CategoryOption[] = [
  { id: "beachfront", label: "Beachfront", icon: "🏖️" },
  { id: "mountains", label: "Mountains", icon: "🏔️" },
  { id: "cabins", label: "Cabins", icon: "🏠" },
  { id: "pools", label: "Amazing pools", icon: "🏊" },
  { id: "city", label: "City", icon: "🌆" },
  { id: "countryside", label: "Countryside", icon: "🌿" },
  { id: "islands", label: "Islands", icon: "🏝️" },
  { id: "arctic", label: "Arctic", icon: "❄️" },
  { id: "tropical", label: "Tropical", icon: "🌴" },
  { id: "skiing", label: "Skiing", icon: "🎿" },
  { id: "luxe", label: "Luxe", icon: "🧖" },
  { id: "tinyhomes", label: "Tiny homes", icon: "🛖" },
  { id: "boats", label: "Boats", icon: "🚢" },
  { id: "lakefront", label: "Lakefront", icon: "🌊" },
  { id: "farms", label: "Farms", icon: "🌾" },
  { id: "castles", label: "Castles", icon: "🏰" },
];

interface CategoryBarProps {
  onOpenFilters: () => void;
}

export function CategoryBar({ onOpenFilters }: CategoryBarProps) {
  const { category, setCategory, syncToUrl, displayTotalPrice, toggleDisplayTotalPrice } = useFilters();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = direction === "left" ? -220 : 220;
    scrollRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  const handleSelectCategory = (catId: string) => {
    const newCategory = category === catId ? "" : catId;
    setCategory(newCategory);
    syncToUrl(undefined, newCategory);
  };

  return (
    <nav className="sticky top-16 lg:top-20 z-40 w-full border-b border-slate-200 bg-white shadow-2xs">
      <div className="mx-auto flex h-[84px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Scrollable Categories List */}
        <div className="relative flex-1 min-w-0 flex items-center">
          {/* Scroll Left Button */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="absolute left-0 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md hover:scale-105 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="no-scrollbar flex items-center gap-8 overflow-x-auto scroll-smooth py-2 px-1"
          >
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`group flex flex-col items-center gap-1.5 shrink-0 transition pb-1 border-b-2 cursor-pointer ${
                    isSelected
                      ? "border-slate-900 text-slate-900 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                  }`}
                >
                  <span className="text-2xl transition group-hover:scale-110">{cat.icon}</span>
                  <span className="text-xs font-semibold whitespace-nowrap">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Scroll Right Button */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="absolute right-0 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-md hover:scale-105 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Right Action Controls: Filters & Display total price toggle */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenFilters}
            className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-900 hover:border-slate-900 transition shadow-2xs"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-semibold text-slate-700">
            <span className="whitespace-nowrap">Display total price</span>
            <button
              type="button"
              onClick={toggleDisplayTotalPrice}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                displayTotalPrice ? "bg-slate-900" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  displayTotalPrice ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
