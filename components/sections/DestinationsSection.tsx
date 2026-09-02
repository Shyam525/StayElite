"use client";

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

const DESTINATIONS = [
  { city: "Bali", country: "Indonesia", photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80" },
  { city: "Paris", country: "France", photo: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" },
  { city: "Tokyo", country: "Japan", photo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80" },
  { city: "New York", country: "United States", photo: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80" },
  { city: "Santorini", country: "Greece", photo: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80" },
  { city: "Maldives", country: "Maldives", photo: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80" },
];

export function DestinationsSection() {
  const { setCity, syncToUrl } = useFilters();

  const handleSelectDestination = (cityName: string) => {
    setCity(cityName);
    syncToUrl(cityName);
    const gridEl = document.getElementById("main-listings-grid");
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#222222] flex items-center gap-2">
              <Compass className="h-5 w-5 text-[#FF385C]" /> Popular Destinations
            </h2>
            <p className="text-xs text-[#717171] mt-0.5">Explore iconic stay locations around the globe</p>
          </div>
        </div>

        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4">
          {DESTINATIONS.map((dest) => (
            <motion.div
              key={dest.city}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleSelectDestination(dest.city)}
              className="group relative aspect-square w-44 sm:w-52 shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-slate-100 shadow-xs"
            >
              <img
                src={dest.photo}
                alt={dest.city}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-base font-extrabold">{dest.city}</h3>
                <p className="text-xs text-white/80 font-medium">{dest.country}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
