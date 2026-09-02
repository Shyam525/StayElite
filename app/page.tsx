"use client";

import { Suspense } from "react";
import { ListingSearchSurface } from "@/components/ListingSearchSurface";
import { SearchUrlHydrator } from "@/components/SearchUrlHydrator";

export default function Home() {
  return <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading stays...</div>}><SearchUrlHydrator /><ListingSearchSurface /></Suspense>;
}
