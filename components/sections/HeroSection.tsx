"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/SearchBar";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-900 py-12 md:py-20">
      {/* Background Image with Dark Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

      {/* Hero Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center space-y-4 mb-8"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold uppercase tracking-[0.25em] text-rose-400"
          >
            ✦ Discover your next escape
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Find your perfect stay
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base font-medium text-slate-300 max-w-xl mx-auto"
          >
            Explore unique luxury homes, beachfront villas, and chalet retreats around the world.
          </motion.p>
        </motion.div>

        {/* Embedded Full Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          <SearchBar isExpanded={false} />
        </motion.div>

        {/* Floating Trust Stats Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] font-semibold text-white/90"
        >
          <span className="rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 border border-white/15">
            ✓ 4M+ Verified Homes
          </span>
          <span className="rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 border border-white/15">
            ✓ 100K+ Destinations
          </span>
          <span className="rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 border border-white/15">
            ✓ 220 Countries
          </span>
        </motion.div>
      </div>
    </section>
  );
}
