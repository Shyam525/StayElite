"use client";

import { Suspense } from "react";
import { ExplorePage } from "@/components/ExplorePage";
import { Loader2 } from "lucide-react";

export default function ExploreAliasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#FF385C]" /> Loading StayElite Stays...
        </div>
      }
    >
      <ExplorePage />
    </Suspense>
  );
}
