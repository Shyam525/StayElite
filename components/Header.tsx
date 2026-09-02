"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, Search, UserRound } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF385C] text-sm font-bold text-white">
            SE
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">StayElite</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Home
          </Link>
          <Link href="/explore" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Explore
          </Link>
          <Link href="/bookings" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Bookings
          </Link>
          <Link href="/host/dashboard" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Host
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 sm:inline-flex">
            <Search className="h-4 w-4" />
          </button>
          <button className="hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 sm:inline-flex">
            <Bell className="h-4 w-4" />
          </button>

          {isAuthenticated && user ? (
            <div className="relative flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {user.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />

              <div className="absolute right-0 top-full mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="flex min-w-[180px] flex-col">
                  <Link href="/host/dashboard" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#FF385C] hover:bg-slate-100">
                    Host Dashboard
                  </Link>
                  <Link href="/profile" className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    Profile
                  </Link>
                  <Link href="/bookings" className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100">
                    My Bookings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-full px-4 text-sm font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full bg-[#FF385C] px-4 text-sm font-medium text-white hover:bg-[#e42d4d]">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
