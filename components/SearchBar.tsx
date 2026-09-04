"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin, CalendarDays, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const POPULAR_CITIES = [
  { city: "Mumbai", country: "India", flag: "🇮🇳" },
  { city: "Paris", country: "France", flag: "🇫🇷" },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵" },
  { city: "Bali", country: "Indonesia", flag: "🇮🇩" },
  { city: "London", country: "UK", flag: "🇬🇧" },
  { city: "New York", country: "USA", flag: "🇺🇸" },
  { city: "Dubai", country: "UAE", flag: "🇦🇪" },
  { city: "Santorini", country: "Greece", flag: "🇬🇷" },
  { city: "Maldives", country: "Maldives", flag: "🇲🇻" },
  { city: "Bangkok", country: "Thailand", flag: "🇹🇭" },
];

type ActiveField = "where" | "checkin" | "checkout" | "who" | null;

interface SearchBarProps {
  isExpanded?: boolean;
  onClose?: () => void;
}

export default function SearchBar({ isExpanded = false, onClose }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [checkIn, setCheckIn] = useState(searchParams.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(searchParams.get("checkOut") || "");
  const [adults, setAdults] = useState(
    Number(searchParams.get("adults")) || Number(searchParams.get("guests")) || 1
  );
  const [children, setChildren] = useState(Number(searchParams.get("children")) || 0);
  const barRef = useRef<HTMLDivElement>(null);

  const totalGuests = adults + children;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = POPULAR_CITIES.filter(
    (c) =>
      city === "" ||
      c.city.toLowerCase().includes(city.toLowerCase()) ||
      c.country.toLowerCase().includes(city.toLowerCase())
  );

  const handleSearch = () => {
    setActiveField(null);
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (totalGuests > 0) params.set("guests", String(totalGuests));
    params.delete("category"); // clear category when performing explicit search

    if (onClose) onClose();
    router.push(`/?${params.toString()}`);
  };

  return (
    <div ref={barRef} className="relative w-full">
      {/* Search pill */}
      <div
        className={cn(
          "flex flex-col md:flex-row items-stretch bg-white rounded-3xl md:rounded-full",
          "border transition-shadow duration-200",
          activeField
            ? "shadow-[0_4px_20px_rgba(0,0,0,0.2)] border-transparent"
            : "border-gray-300 shadow-[0_3px_12px_rgba(0,0,0,0.1)]",
          "hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)]"
        )}
      >
        {/* WHERE */}
        <button
          type="button"
          onClick={() => setActiveField(activeField === "where" ? null : "where")}
          className={cn(
            "flex-1 flex flex-col items-start px-6 py-3 rounded-3xl md:rounded-full text-left",
            "hover:bg-gray-100 transition-colors min-w-0 cursor-pointer",
            activeField === "where" && "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          )}
        >
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            Where
          </span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search destinations"
            className="w-full text-sm font-semibold text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
            onClick={(e) => {
              e.stopPropagation();
              setActiveField("where");
            }}
          />
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-300 my-3 self-stretch" />

        {/* CHECK IN */}
        <button
          type="button"
          onClick={() => setActiveField(activeField === "checkin" ? null : "checkin")}
          className={cn(
            "flex flex-col items-start px-6 py-3 rounded-3xl md:rounded-full text-left",
            "hover:bg-gray-100 transition-colors min-w-[130px] cursor-pointer",
            activeField === "checkin" && "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          )}
        >
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            Check in
          </span>
          <span className="text-sm font-semibold text-gray-600">
            {checkIn ? (
              format(new Date(checkIn), "MMM d")
            ) : (
              <span className="text-gray-400 font-normal">Add dates</span>
            )}
          </span>
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-300 my-3 self-stretch" />

        {/* CHECK OUT */}
        <button
          type="button"
          onClick={() => setActiveField(activeField === "checkout" ? null : "checkout")}
          className={cn(
            "flex flex-col items-start px-6 py-3 rounded-3xl md:rounded-full text-left",
            "hover:bg-gray-100 transition-colors min-w-[130px] cursor-pointer",
            activeField === "checkout" && "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          )}
        >
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            Check out
          </span>
          <span className="text-sm font-semibold text-gray-600">
            {checkOut ? (
              format(new Date(checkOut), "MMM d")
            ) : (
              <span className="text-gray-400 font-normal">Add dates</span>
            )}
          </span>
        </button>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-300 my-3 self-stretch" />

        {/* WHO + SEARCH BUTTON */}
        <button
          type="button"
          onClick={() => setActiveField(activeField === "who" ? null : "who")}
          className={cn(
            "flex items-center justify-between md:justify-start gap-4 pl-6 pr-3 py-3 rounded-3xl md:rounded-full text-left",
            "hover:bg-gray-100 transition-colors cursor-pointer",
            activeField === "who" && "bg-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          )}
        >
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
              Who
            </span>
            <span className="text-sm font-semibold text-gray-600 whitespace-nowrap">
              {totalGuests > 0 ? (
                `${totalGuests} guest${totalGuests > 1 ? "s" : ""}`
              ) : (
                <span className="text-gray-400 font-normal">Add guests</span>
              )}
            </span>
          </div>

          {/* Search button */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleSearch();
            }}
            className={cn(
              "flex items-center justify-center gap-2 rounded-full transition-all cursor-pointer shadow-md",
              city || checkIn || checkOut
                ? "bg-[#FF385C] text-white px-5 py-3 hover:bg-[#e42d4d]"
                : "bg-[#FF385C] text-white p-3 hover:bg-[#e42d4d]"
            )}
          >
            <Search size={16} />
            {(city || checkIn || checkOut || isExpanded) && (
              <span className="text-sm font-bold">Search</span>
            )}
          </div>
        </button>
      </div>

      {/* ── WHERE Dropdown ── */}
      {activeField === "where" && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-full md:w-80 bg-white rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.2)] border border-gray-100 p-4 z-50 animate-in fade-in duration-150">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Popular destinations
          </p>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {filteredCities.map((c) => (
              <div
                key={c.city}
                onClick={() => {
                  setCity(c.city);
                  setActiveField("checkin");
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                  {c.flag}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{c.city}</p>
                  <p className="text-xs text-gray-500">{c.country}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHECK IN Dropdown ── */}
      {activeField === "checkin" && (
        <div className="absolute top-[calc(100%+12px)] left-0 md:left-1/4 bg-white rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.2)] border border-gray-100 p-6 z-50 animate-in fade-in duration-150">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Select check-in date
          </p>
          <input
            type="date"
            value={checkIn}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && e.target.value >= checkOut) setCheckOut("");
              setActiveField("checkout");
            }}
            className="border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF385C] cursor-pointer"
          />
        </div>
      )}

      {/* ── CHECK OUT Dropdown ── */}
      {activeField === "checkout" && (
        <div className="absolute top-[calc(100%+12px)] left-0 md:left-1/2 bg-white rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.2)] border border-gray-100 p-6 z-50 animate-in fade-in duration-150">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Select check-out date
          </p>
          <input
            type="date"
            value={checkOut}
            min={checkIn || format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => {
              setCheckOut(e.target.value);
              setActiveField("who");
            }}
            className="border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF385C] cursor-pointer"
          />
        </div>
      )}

      {/* ── WHO Dropdown ── */}
      {activeField === "who" && (
        <div className="absolute top-[calc(100%+12px)] right-0 w-full md:w-80 bg-white rounded-2xl shadow-[0_8px_28px_rgba(0,0,0,0.2)] border border-gray-100 p-6 z-50 space-y-6 animate-in fade-in duration-150">
          {[
            { label: "Adults", sub: "Ages 13+", count: adults, set: setAdults, min: 1 },
            { label: "Children", sub: "Ages 2–12", count: children, set: setChildren, min: 0 },
          ].map(({ label, sub, count, set, min }) => (
            <div key={label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => set(Math.max(min, count - 1))}
                  disabled={count <= min}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-bold">{count}</span>
                <button
                  type="button"
                  onClick={() => set(count + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-900 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { SearchBar };
