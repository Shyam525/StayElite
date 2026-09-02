"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  CalendarDays,
  FileSpreadsheet,
  Plus,
  DollarSign,
  Download,
  Settings,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import {
  getStoredListings,
  saveStoredListings,
  getStoredBookings,
  saveStoredBookings,
  calculateHostStats,
  exportEarningsReportCSV,
  INITIAL_MONTHLY_EARNINGS,
} from "@/services/hostService";
import type { HostListing, HostBooking, HostStats } from "@/types/host";
import { StatsOverview } from "@/components/host/StatsOverview";
import { EarningsChart } from "@/components/host/EarningsChart";
import { MyListingsTable } from "@/components/host/MyListingsTable";
import { RecentBookingsTable } from "@/components/host/RecentBookingsTable";
import { ListingCalendarView } from "@/components/host/ListingCalendarView";
import { QuickActionsModal } from "@/components/host/QuickActionsModal";

export default function HostDashboardPage() {
  const [listings, setListings] = useState<HostListing[]>([]);
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "bookings" | "calendar">("overview");
  const [editingListing, setEditingListing] = useState<HostListing | null>(null);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadedListings = getStoredListings();
    const loadedBookings = getStoredBookings();
    setListings(loadedListings);
    setBookings(loadedBookings);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleToggleListingStatus = (id: string) => {
    const updated = listings.map((l) => {
      if (l.id === id) {
        const nextStatus: "ACTIVE" | "INACTIVE" = l.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        showToast(`Listing "${l.title.slice(0, 20)}..." is now ${nextStatus.toLowerCase()}`);
        return { ...l, status: nextStatus };
      }
      return l;
    });
    setListings(updated);
    saveStoredListings(updated);
  };

  const handleConfirmBooking = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        showToast(`Booking for ${b.guestName} confirmed!`);
        return { ...b, status: "CONFIRMED" as const };
      }
      return b;
    });
    setBookings(updated);
    saveStoredBookings(updated);
  };

  const handleDeclineBooking = (id: string) => {
    const updated = bookings.map((b) => {
      if (b.id === id) {
        showToast(`Booking request declined.`);
        return { ...b, status: "CANCELLED" as const };
      }
      return b;
    });
    setBookings(updated);
    saveStoredBookings(updated);
  };

  const handleUpdateListingPrice = (listingId: string, newPrice: number) => {
    const updated = listings.map((l) =>
      l.id === listingId ? { ...l, pricePerNight: newPrice } : l
    );
    setListings(updated);
    saveStoredListings(updated);
    showToast(`Pricing updated to $${newPrice}/night`);
  };

  const handleUpdateListingDetails = (
    listingId: string,
    details: { title: string; pricePerNight: number; bedrooms: number; maxGuests: number }
  ) => {
    const updated = listings.map((l) =>
      l.id === listingId ? { ...l, ...details } : l
    );
    setListings(updated);
    saveStoredListings(updated);
    showToast(`Listing details updated`);
  };

  const handleExportCSV = () => {
    exportEarningsReportCSV(bookings);
    showToast("Earnings report downloaded successfully!");
  };

  const stats: HostStats = calculateHostStats(bookings, listings);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Host Header Banner */}
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#FF385C]">
                <Sparkles className="h-3.5 w-3.5" /> Host Control Center
              </span>
              <span className="text-xs text-slate-400">• Superhost Status</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Host Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your properties, review incoming bookings, track revenue, and update availability calendars.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Action Button */}
            <button
              type="button"
              onClick={() => setIsQuickActionsOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <SlidersHorizontal className="h-4 w-4 text-slate-500" /> Quick Actions & Pricing
            </button>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <Download className="h-4 w-4 text-slate-500" /> Download Earnings (CSV)
            </button>

            {/* Add New Listing Button */}
            <Link href="/host/create-listing">
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#FF385C] px-5 text-xs font-semibold text-white shadow-sm hover:bg-[#e42d4d] transition"
              >
                <Plus className="h-4 w-4" /> Add New Listing
              </button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "overview"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Overview & Charts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("listings")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "listings"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Building2 className="h-4 w-4" /> My Listings ({listings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "bookings"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <FileSpreadsheet className="h-4 w-4" /> Bookings ({bookings.length})
            {stats.pendingBookingsCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-slate-950">
                {stats.pendingBookingsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "calendar"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <CalendarDays className="h-4 w-4" /> Availability Calendar
          </button>
        </div>

        {/* TAB 1: OVERVIEW & CHARTS */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-8">
            {/* Top Row Stats Cards */}
            <StatsOverview
              stats={stats}
              onFilterPending={() => setActiveTab("bookings")}
            />

            {/* Earnings Line Chart */}
            <EarningsChart data={INITIAL_MONTHLY_EARNINGS} />

            {/* Grid of Listings & Recent Bookings Preview */}
            <div className="grid grid-cols-1 gap-8">
              <RecentBookingsTable
                bookings={bookings}
                onConfirmBooking={handleConfirmBooking}
                onDeclineBooking={handleDeclineBooking}
              />

              <MyListingsTable
                listings={listings}
                onToggleStatus={handleToggleListingStatus}
                onEditListing={(listing) => {
                  setEditingListing(listing);
                  setIsQuickActionsOpen(true);
                }}
              />
            </div>

            {/* Calendar Section */}
            <ListingCalendarView listings={listings} bookings={bookings} />
          </div>
        )}

        {/* TAB 2: MY LISTINGS ONLY */}
        {activeTab === "listings" && (
          <div className="mt-6">
            <MyListingsTable
              listings={listings}
              onToggleStatus={handleToggleListingStatus}
              onEditListing={(listing) => {
                setEditingListing(listing);
                setIsQuickActionsOpen(true);
              }}
            />
          </div>
        )}

        {/* TAB 3: BOOKINGS ONLY */}
        {activeTab === "bookings" && (
          <div className="mt-6">
            <RecentBookingsTable
              bookings={bookings}
              onConfirmBooking={handleConfirmBooking}
              onDeclineBooking={handleDeclineBooking}
            />
          </div>
        )}

        {/* TAB 4: CALENDAR ONLY */}
        {activeTab === "calendar" && (
          <div className="mt-6">
            <ListingCalendarView listings={listings} bookings={bookings} />
          </div>
        )}
      </div>

      {/* Quick Actions / Pricing Modal */}
      {isQuickActionsOpen && (
        <QuickActionsModal
          listings={listings}
          bookings={bookings}
          activeListingToEdit={editingListing}
          onClose={() => {
            setIsQuickActionsOpen(false);
            setEditingListing(null);
          }}
          onUpdateListingPrice={handleUpdateListingPrice}
          onUpdateListingDetails={handleUpdateListingDetails}
          onExportCSV={handleExportCSV}
        />
      )}
    </main>
  );
}
