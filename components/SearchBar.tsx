"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users, X, Minus, Plus } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";
import type { DestinationOption } from "@/types/search";

const POPULAR_DESTINATIONS: DestinationOption[] = [
  { city: "Mumbai", country: "India", flag: "🇮🇳", label: "Mumbai, India", photoUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80" },
  { city: "Paris", country: "France", flag: "🇫🇷", label: "Paris, France", photoUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80" },
  { city: "Tokyo", country: "Japan", flag: "🇯🇵", label: "Tokyo, Japan", photoUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80" },
  { city: "Bali", country: "Indonesia", flag: "🇮🇩", label: "Bali, Indonesia", photoUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80" },
  { city: "London", country: "United Kingdom", flag: "🇬🇧", label: "London, UK", photoUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80" },
  { city: "New York", country: "United States", flag: "🇺🇸", label: "New York, USA", photoUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80" },
];

interface SearchBarProps {
  isExpanded?: boolean;
  onClose?: () => void;
}

export function SearchBar({ isExpanded = false, onClose }: SearchBarProps) {
  const router = useRouter();
  const { city, checkIn, checkOut, guests, setCity, setDates, setGuests, syncToUrl } = useFilters();

  const [activeTab, setActiveTab] = useState<"stays" | "experiences" | "online">("stays");
  const [activeSection, setActiveSection] = useState<"where" | "checkIn" | "checkOut" | "who" | null>(null);

  const totalGuests = guests.adults + guests.children;

  const handleSelectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setActiveSection("checkIn");
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    syncToUrl(city, undefined, checkIn || undefined, checkOut || undefined, totalGuests);
    if (onClose) onClose();

    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (totalGuests > 1) params.set("guests", String(totalGuests));

    router.push(`/explore?${params.toString()}`);
  };

  return (
    <>
      {/* Dark Overlay when search bar section is open */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-2xs"
          />
        )}
      </AnimatePresence>

      <div className={`relative z-50 w-full ${isExpanded ? "max-w-4xl mx-auto" : ""}`}>
        {/* Top Tabs */}
        <div className="flex items-center justify-center gap-6 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab("stays")}
            className={`text-xs font-bold transition py-1 border-b-2 ${
              activeTab === "stays"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Stays
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("experiences")}
            className={`text-xs font-bold transition py-1 border-b-2 ${
              activeTab === "experiences"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Experiences
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("online")}
            className={`text-xs font-bold transition py-1 border-b-2 ${
              activeTab === "online"
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            Online Experiences
          </button>
        </div>

        {/* 4-Section Pill Bar */}
        <div className="relative flex flex-col md:flex-row items-center rounded-3xl md:rounded-full border border-slate-200 bg-white p-2 shadow-lg transition-all duration-200">
          {/* SECTION 1: WHERE */}
          <div
            onClick={() => setActiveSection("where")}
            className={`relative flex-1 w-full rounded-2xl md:rounded-full px-5 py-3 cursor-pointer transition hover:bg-slate-100/80 ${
              activeSection === "where" ? "bg-white shadow-md ring-1 ring-slate-200" : ""
            }`}
          >
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
              Where
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search destinations"
              className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
            />

            {/* Where Dropdown */}
            {activeSection === "where" && (
              <div className="absolute left-0 top-16 z-50 w-full md:w-96 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in duration-150">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Popular destinations
                </p>
                <div className="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto">
                  {POPULAR_DESTINATIONS.filter((d) =>
                    d.label.toLowerCase().includes(city.toLowerCase())
                  ).map((item) => (
                    <div
                      key={item.city}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectCity(item.city);
                      }}
                      className="flex items-center gap-2.5 rounded-2xl p-2 hover:bg-slate-100 cursor-pointer transition"
                    >
                      <span className="text-xl">{item.flag}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{item.city}</p>
                        <p className="text-[10px] text-slate-500 truncate">{item.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <span className="hidden md:block h-8 w-px bg-slate-200" />

          {/* SECTION 2: CHECK IN */}
          <div
            onClick={() => setActiveSection("checkIn")}
            className={`relative flex-1 w-full rounded-2xl md:rounded-full px-5 py-3 cursor-pointer transition hover:bg-slate-100/80 ${
              activeSection === "checkIn" ? "bg-white shadow-md ring-1 ring-slate-200" : ""
            }`}
          >
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
              Check in
            </label>
            <span className="text-xs font-semibold text-slate-900 truncate block">
              {checkIn || "Add dates"}
            </span>

            {activeSection === "checkIn" && (
              <div className="absolute left-0 top-16 z-50 w-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in duration-150">
                <p className="text-xs font-bold text-slate-900 mb-2">Select Check-in Date</p>
                <input
                  type="date"
                  value={checkIn || ""}
                  onChange={(e) => {
                    setDates(e.target.value, checkOut);
                    setActiveSection("checkOut");
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                />
              </div>
            )}
          </div>

          <span className="hidden md:block h-8 w-px bg-slate-200" />

          {/* SECTION 3: CHECK OUT */}
          <div
            onClick={() => setActiveSection("checkOut")}
            className={`relative flex-1 w-full rounded-2xl md:rounded-full px-5 py-3 cursor-pointer transition hover:bg-slate-100/80 ${
              activeSection === "checkOut" ? "bg-white shadow-md ring-1 ring-slate-200" : ""
            }`}
          >
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
              Check out
            </label>
            <span className="text-xs font-semibold text-slate-900 truncate block">
              {checkOut || "Add dates"}
            </span>

            {activeSection === "checkOut" && (
              <div className="absolute left-0 top-16 z-50 w-72 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in duration-150">
                <p className="text-xs font-bold text-slate-900 mb-2">Select Check-out Date</p>
                <input
                  type="date"
                  value={checkOut || ""}
                  onChange={(e) => {
                    setDates(checkIn, e.target.value);
                    setActiveSection("who");
                  }}
                  className="w-full rounded-xl border border-slate-200 p-2 text-xs font-medium"
                />
              </div>
            )}
          </div>

          <span className="hidden md:block h-8 w-px bg-slate-200" />

          {/* SECTION 4: WHO */}
          <div
            onClick={() => setActiveSection("who")}
            className={`relative flex-1 w-full rounded-2xl md:rounded-full px-5 py-3 cursor-pointer transition hover:bg-slate-100/80 ${
              activeSection === "who" ? "bg-white shadow-md ring-1 ring-slate-200" : ""
            }`}
          >
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
              Who
            </label>
            <span className="text-xs font-semibold text-slate-900 truncate block">
              {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? "s" : ""}` : "Add guests"}
            </span>

            {/* Who Steppers Dropdown */}
            {activeSection === "who" && (
              <div className="absolute right-0 top-16 z-50 w-80 rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl animate-in fade-in duration-150 space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Adults</p>
                    <p className="text-[11px] text-slate-500">Ages 13 or above</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={guests.adults <= 1}
                      onClick={() => setGuests({ adults: guests.adults - 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900 disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-4 text-center">
                      {guests.adults}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests({ adults: guests.adults + 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Children</p>
                    <p className="text-[11px] text-slate-500">Ages 2–12</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={guests.children <= 0}
                      onClick={() => setGuests({ children: guests.children - 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900 disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-4 text-center">
                      {guests.children}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests({ children: guests.children + 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Infants</p>
                    <p className="text-[11px] text-slate-500">Under 2</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={guests.infants <= 0}
                      onClick={() => setGuests({ infants: guests.infants - 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900 disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-4 text-center">
                      {guests.infants}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests({ infants: guests.infants + 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Pets */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Pets</p>
                    <p className="text-[11px] text-slate-500">Service animals welcome</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={guests.pets <= 0}
                      onClick={() => setGuests({ pets: guests.pets - 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900 disabled:opacity-30"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-4 text-center">
                      {guests.pets}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuests({ pets: guests.pets + 1 })}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:border-slate-900"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEARCH BUTTON */}
          <button
            type="button"
            onClick={handleSearchSubmit}
            className="flex h-12 w-full md:w-auto items-center justify-center gap-2 rounded-full bg-[#FF385C] px-6 text-xs font-bold text-white shadow-md hover:bg-[#e42d4d] transition shrink-0 mt-2 md:mt-0"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
        </div>
      </div>
    </>
  );
}
