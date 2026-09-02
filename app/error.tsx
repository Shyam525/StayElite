"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root Error boundary captured error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-[#FF385C] mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-xs text-slate-500 leading-relaxed">
        We encountered an error loading this page. Please try again or return to the home page.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-[#FF385C] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#e42d4d] transition"
        >
          <RotateCcw className="h-4 w-4" /> Try again
        </button>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <Home className="h-4 w-4" /> Return Home
        </Link>
      </div>
    </main>
  );
}
