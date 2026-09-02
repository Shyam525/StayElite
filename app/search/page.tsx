import { Suspense } from "react";
import { ListingSearchSurface } from "@/components/ListingSearchSurface";
import { SearchUrlHydrator } from "@/components/SearchUrlHydrator";

export default function SearchPage() {
  return <Suspense fallback={<div className="mx-auto max-w-6xl py-20 text-center text-slate-500">Loading stays...</div>}><SearchUrlHydrator /><ListingSearchSurface searchPage /></Suspense>;
}
