import { Suspense } from "react";
import { ListingSearchSurface } from "@/components/ListingSearchSurface";

export default function SearchPage() {
  return <Suspense fallback={<div className="mx-auto max-w-6xl py-20 text-center text-slate-500">Loading stays...</div>}><ListingSearchSurface searchPage /></Suspense>;
}
