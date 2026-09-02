"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Lock, Unlock, Calendar as CalendarIcon, Info } from "lucide-react";
import type { HostListing, HostBooking } from "@/types/host";

interface ListingCalendarViewProps {
  listings: HostListing[];
  bookings: HostBooking[];
}

type DateStatus = "available" | "booked" | "blocked";

export function ListingCalendarView({ listings, bookings }: ListingCalendarViewProps) {
  const [selectedListingId, setSelectedListingId] = useState<string>(
    listings[0]?.id || ""
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 1)); // Sept 2026
  const [blockedDatesMap, setBlockedDatesMap] = useState<Record<string, boolean>>({
    // Default blocked date samples for prop-101
    "2026-09-08": true,
    "2026-09-09": true,
    "2026-09-28": true,
  });

  const [selectionRange, setSelectionRange] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });

  const currentListing = listings.find((l) => l.id === selectedListingId) || listings[0];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectionRange({ start: null, end: null });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectionRange({ start: null, end: null });
  };

  // Helper to format date string YYYY-MM-DD
  const formatDateKey = (dayNum: number): string => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(dayNum).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  // Check if date is booked by guest in current listing
  const getBookingForDate = (dateStr: string): HostBooking | undefined => {
    return bookings.find(
      (b) =>
        b.listingId === selectedListingId &&
        b.status !== "CANCELLED" &&
        dateStr >= b.checkIn &&
        dateStr < b.checkOut
    );
  };

  const getDateStatus = (dateStr: string): { status: DateStatus; booking?: HostBooking } => {
    const booking = getBookingForDate(dateStr);
    if (booking) return { status: "booked", booking };
    if (blockedDatesMap[dateStr]) return { status: "blocked" };
    return { status: "available" };
  };

  const handleDateClick = (dateStr: string, status: DateStatus) => {
    if (status === "booked") return; // Cannot alter guest booking directly from click

    // If range selection active
    if (!selectionRange.start || (selectionRange.start && selectionRange.end)) {
      setSelectionRange({ start: dateStr, end: null });
    } else {
      if (dateStr < selectionRange.start) {
        setSelectionRange({ start: dateStr, end: selectionRange.start });
      } else {
        setSelectionRange({ start: selectionRange.start, end: dateStr });
      }
    }
  };

  const isSelectedInRange = (dateStr: string): boolean => {
    if (!selectionRange.start) return false;
    if (selectionRange.start && !selectionRange.end) return dateStr === selectionRange.start;
    if (selectionRange.start && selectionRange.end) {
      return dateStr >= selectionRange.start && dateStr <= selectionRange.end;
    }
    return false;
  };

  const applyBlockAction = (block: boolean) => {
    if (!selectionRange.start) return;

    const newMap = { ...blockedDatesMap };
    const startDate = selectionRange.start;
    const endDate = selectionRange.end || selectionRange.start;

    // Iterate dates between startDate and endDate
    let cur = new Date(startDate);
    const end = new Date(endDate);

    while (cur <= end) {
      const y = cur.getFullYear();
      const m = String(cur.getMonth() + 1).padStart(2, "0");
      const d = String(cur.getDate()).padStart(2, "0");
      const key = `${y}-${m}-${d}`;

      // Only block/unblock if not booked
      if (!getBookingForDate(key)) {
        if (block) {
          newMap[key] = true;
        } else {
          delete newMap[key];
        }
      }
      cur.setDate(cur.getDate() + 1);
    }

    setBlockedDatesMap(newMap);
    setSelectionRange({ start: null, end: null });
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Calendar Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-[#FF385C]" /> Availability Calendar
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Block or unblock dates to manage guest availability and rate rules.
          </p>
        </div>

        {/* Listing Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="listing-select" className="text-xs font-semibold text-slate-600">
            Listing:
          </label>
          <select
            id="listing-select"
            value={selectedListingId}
            onChange={(e) => {
              setSelectedListingId(e.target.value);
              setSelectionRange({ start: null, end: null });
            }}
            className="h-10 rounded-full border border-slate-200 bg-slate-50/50 px-4 text-xs font-semibold text-slate-900 focus:border-[#FF385C] focus:bg-white focus:outline-none cursor-pointer max-w-xs"
          >
            {listings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.title} (${l.pricePerNight}/night)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Month & Legend Bar */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Month Nav */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-base font-bold text-slate-900 w-36 text-center">
            {monthNames[month]} {year}
          </span>

          <button
            type="button"
            onClick={nextMonth}
            className="rounded-full border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Color Legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#FF385C]" />
            <span>Booked by Guest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-400" />
            <span>Blocked by Host</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span>Selected Range</span>
          </div>
        </div>
      </div>

      {/* Range Action Notification Bar */}
      {selectionRange.start && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              Selected range: <strong>{selectionRange.start}</strong>{" "}
              {selectionRange.end ? `to ${selectionRange.end}` : "(Click end date to extend)"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => applyBlockAction(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <Lock className="h-3.5 w-3.5" /> Block Dates
            </button>

            <button
              type="button"
              onClick={() => applyBlockAction(false)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <Unlock className="h-3.5 w-3.5" /> Unblock
            </button>

            <button
              type="button"
              onClick={() => setSelectionRange({ start: null, end: null })}
              className="text-xs text-slate-500 hover:underline px-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid Days Header */}
      <div className="mt-6 grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Grid Day Cells */}
      <div className="mt-2 grid grid-cols-7 gap-2">
        {/* Empty padding cells before first day */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 rounded-2xl bg-slate-50/40" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = formatDateKey(dayNum);
          const { status, booking } = getDateStatus(dateStr);
          const inRange = isSelectedInRange(dateStr);

          let cellBg = "bg-white border-slate-200 hover:border-slate-400 text-slate-900";
          let badgeText = `$${currentListing?.pricePerNight}`;

          if (status === "booked") {
            cellBg = "bg-rose-50 border-rose-200 text-rose-900 cursor-not-allowed";
            badgeText = booking?.guestName || "Booked";
          } else if (status === "blocked") {
            cellBg = "bg-slate-100 border-slate-200 text-slate-500";
            badgeText = "Blocked";
          }

          if (inRange) {
            cellBg = "bg-amber-100 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-400";
          }

          return (
            <div
              key={dateStr}
              onClick={() => handleDateClick(dateStr, status)}
              className={`group relative flex h-20 cursor-pointer flex-col justify-between rounded-2xl border p-2.5 transition-all duration-150 ${cellBg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{dayNum}</span>
                {status === "booked" && <span className="h-2 w-2 rounded-full bg-[#FF385C]" />}
                {status === "blocked" && <Lock className="h-3 w-3 text-slate-400" />}
              </div>

              <div className="truncate text-[11px] font-semibold">
                {status === "booked" ? (
                  <span className="text-rose-700 flex items-center gap-0.5">
                    👤 {badgeText}
                  </span>
                ) : status === "blocked" ? (
                  <span className="text-slate-500 italic">{badgeText}</span>
                ) : (
                  <span className="text-emerald-700">{badgeText}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
