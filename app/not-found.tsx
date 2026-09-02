import Link from "next/link";
import { Compass, Flame } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[600px] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-[#FF385C] mb-4">
        <Flame className="h-8 w-8 fill-current" />
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        404 — Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-xs text-slate-500 leading-relaxed">
        We couldn't find the stay or page you're looking for. It might have been moved or deleted.
      </p>

      <Link href="/">
        <button
          type="button"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#FF385C] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#e42d4d] transition"
        >
          <Compass className="h-4 w-4" /> Explore StayElite Stays
        </button>
      </Link>
    </main>
  );
}
