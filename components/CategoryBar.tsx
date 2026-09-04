"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFilters } from "@/hooks/useFilters";

const CATEGORIES = [
  { id: "beachfront", label: "Beachfront", emoji: "🏖️" },
  { id: "mountains", label: "Mountains", emoji: "🏔️" },
  { id: "cabins", label: "Cabins", emoji: "🏠" },
  { id: "amazing-pools", label: "Amazing pools", emoji: "🏊" },
  { id: "city", label: "City", emoji: "🌆" },
  { id: "countryside", label: "Countryside", emoji: "🌿" },
  { id: "islands", label: "Islands", emoji: "🏝️" },
  { id: "arctic", label: "Arctic", emoji: "❄️" },
  { id: "tropical", label: "Tropical", emoji: "🌴" },
  { id: "skiing", label: "Skiing", emoji: "🎿" },
  { id: "luxe", label: "Luxe", emoji: "✨" },
  { id: "tiny-homes", label: "Tiny homes", emoji: "🛖" },
  { id: "boats", label: "Boats", emoji: "⛵" },
  { id: "lakefront", label: "Lakefront", emoji: "🌊" },
  { id: "farms", label: "Farms", emoji: "🌾" },
  { id: "castles", label: "Castles", emoji: "🏰" },
];

interface CategoryBarProps {
  onOpenFilters?: () => void;
  onFilterClick?: () => void;
}

export default function CategoryBar({ onOpenFilters, onFilterClick }: CategoryBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { displayTotalPrice, toggleDisplayTotalPrice } = useFilters();

  const selectedCategory = searchParams.get("category") || "";

  const handleCategoryClick = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (selectedCategory === categoryId) {
      params.delete("category");
    } else {
      params.set("category", categoryId);
    }

    params.delete("page");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, []);

  const scrollBy = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const handleFiltersClick = () => {
    if (onOpenFilters) onOpenFilters();
    else if (onFilterClick) onFilterClick();
  };

  return (
    <nav className="sticky top-16 lg:top-20 z-40 bg-white border-b border-gray-200 shadow-2xs">
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 flex items-center gap-4 h-[84px]">
        {/* Left scroll arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy("left")}
            className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Scrollable categories */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="no-scrollbar flex items-center gap-7 overflow-x-auto flex-1 scroll-smooth py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.id)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center gap-1.5 pb-3 pt-1 cursor-pointer",
                  "border-b-2 transition-all duration-200",
                  "hover:border-gray-400 hover:text-gray-900",
                  isSelected
                    ? "border-gray-900 text-gray-900 font-bold"
                    : "border-transparent text-gray-500"
                )}
              >
                <span className="text-[26px] leading-none select-none">
                  {cat.emoji}
                </span>
                <span
                  className={cn(
                    "text-xs whitespace-nowrap font-medium",
                    isSelected ? "text-gray-900 font-bold" : "text-gray-500"
                  )}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right scroll arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy("right")}
            className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 bg-white shadow-sm flex items-center justify-center hover:shadow-md transition-shadow z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        )}

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200 flex-shrink-0 mx-1 hidden sm:block" />

        {/* Filters button */}
        <button
          type="button"
          onClick={handleFiltersClick}
          className="flex-shrink-0 hidden sm:flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-full text-xs font-bold text-gray-900 hover:shadow-md hover:border-gray-400 transition-all cursor-pointer"
        >
          <SlidersHorizontal size={15} />
          <span>Filters</span>
        </button>

        {/* Display total price toggle */}
        <div className="flex-shrink-0 hidden sm:flex items-center gap-2 text-xs font-semibold text-gray-700">
          <span className="whitespace-nowrap hidden md:block">Display total price</span>
          <button
            type="button"
            role="switch"
            aria-checked={displayTotalPrice}
            onClick={toggleDisplayTotalPrice}
            className={cn(
              "relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              displayTotalPrice ? "bg-gray-900" : "bg-gray-200"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                displayTotalPrice ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </nav>
  );
}

export { CategoryBar };
