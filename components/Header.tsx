"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  Globe,
  Menu,
  Search,
  User,
  Heart,
  Briefcase,
  LogOut,
  HelpCircle,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useAuthStore } from "@/store/authStore";
import { SearchBar } from "@/components/SearchBar";

export function Header() {
  const pathname = usePathname();
  const { isScrolled } = useScrollPosition();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 border-b border-slate-200 ${
          isScrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
          {/* LEFT: LOGO */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C] transition group-hover:scale-105 group-hover:bg-[#FF385C] group-hover:text-white shadow-2xs">
              <Flame className="h-6 w-6 fill-current" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Stay<span className="text-[#FF385C]">Elite</span>
            </span>
          </Link>

          {/* CENTER: MINI SEARCH BAR (Desktop) */}
          <div className="hidden lg:block">
            {!isSearchExpanded ? (
              <button
                type="button"
                onClick={() => setIsSearchExpanded(true)}
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white py-2 pl-5 pr-2 shadow-2xs hover:shadow-md transition duration-200 cursor-pointer"
              >
                <span className="text-xs font-bold text-slate-900">Anywhere</span>
                <span className="h-4 w-px bg-slate-200" />
                <span className="text-xs font-bold text-slate-900">Any week</span>
                <span className="h-4 w-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-500">Add guests</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF385C] text-white shadow-xs">
                  <Search className="h-4 w-4" />
                </div>
              </button>
            ) : null}
          </div>

          {/* RIGHT: NAVIGATION & USER MENU */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/host/dashboard"
              className="hidden rounded-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition md:inline-block"
            >
              Become a host
            </Link>

            <button
              type="button"
              className="hidden rounded-full p-2.5 text-slate-700 hover:bg-slate-100 transition sm:inline-block"
              aria-label="Language & Region"
            >
              <Globe className="h-4 w-4" />
            </button>

            {/* User Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1.5 pl-3 pr-1.5 shadow-2xs hover:shadow-md transition duration-200 cursor-pointer"
              >
                <Menu className="h-4 w-4 text-slate-600" />
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || "User"}
                    className="h-8 w-8 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                    {user?.fullName ? user.fullName.charAt(0) : <User className="h-4 w-4" />}
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-12 z-50 w-56 rounded-2xl border border-slate-200 bg-white py-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    {isAuthenticated ? (
                      <>
                        <div className="border-b border-slate-100 px-4 py-2.5">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {user?.fullName || "StayElite Guest"}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        </div>

                        <Link
                          href="/trips"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Briefcase className="h-4 w-4 text-slate-500" /> My Trips
                        </Link>

                        <Link
                          href="/wishlists"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Heart className="h-4 w-4 text-[#FF385C]" /> Wishlists
                        </Link>

                        <Link
                          href="/messages"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <Sparkles className="h-4 w-4 text-slate-500" /> Messages
                        </Link>

                        <Link
                          href="/host/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          <LayoutDashboard className="h-4 w-4 text-slate-500" /> Host Dashboard
                        </Link>

                        <div className="my-1 border-t border-slate-100" />

                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition text-left"
                        >
                          <LogOut className="h-4 w-4" /> Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-bold text-slate-900 hover:bg-slate-50 transition"
                        >
                          Log in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Sign up
                        </Link>
                        <div className="my-1 border-t border-slate-100" />
                        <Link
                          href="/host/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Host your home
                        </Link>
                        <a
                          href="#"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Help Center
                        </a>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Full Search Bar in Header when expanded */}
        {isSearchExpanded && (
          <div className="border-t border-slate-100 bg-white py-4 px-4 shadow-md transition">
            <div className="mx-auto max-w-4xl">
              <SearchBar
                isExpanded={true}
                onClose={() => setIsSearchExpanded(false)}
              />
            </div>
          </div>
        )}
      </header>

      {/* Mobile Search Trigger Pill */}
      <div className="sticky top-16 z-40 bg-white px-4 py-2.5 border-b border-slate-200 lg:hidden">
        <button
          type="button"
          onClick={() => setIsSearchExpanded(true)}
          className="flex w-full items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2.5 shadow-2xs hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-[#FF385C]" />
            <div className="text-left">
              <p className="text-xs font-bold text-slate-900">Where to?</p>
              <p className="text-[11px] text-slate-500">Anywhere · Any week · Add guests</p>
            </div>
          </div>
          <div className="rounded-full border border-slate-200 p-2">
            <Search className="h-3.5 w-3.5 text-slate-600" />
          </div>
        </button>
      </div>
    </>
  );
}

export default Header;
