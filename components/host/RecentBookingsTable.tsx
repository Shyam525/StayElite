"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Check, X, Calendar, User, Search, Filter, Inbox } from "lucide-react";
import type { HostBooking } from "@/types/host";

interface RecentBookingsTableProps {
  bookings: HostBooking[];
  onConfirmBooking: (id: string) => void;
  onDeclineBooking: (id: string) => void;
}

const columnHelper = createColumnHelper<HostBooking>();

export function RecentBookingsTable({
  bookings,
  onConfirmBooking,
  onDeclineBooking,
}: RecentBookingsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredData = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  const columns = [
    // 1. Guest Avatar & Name
    columnHelper.accessor("guestName", {
      header: "Guest",
      cell: (info) => {
        const booking = info.row.original;
        return (
          <div className="flex items-center gap-3 py-1 min-w-[180px]">
            <img
              src={booking.guestAvatar}
              alt={booking.guestName}
              className="h-10 w-10 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">
                {booking.guestName}
              </p>
              <p className="text-xs text-slate-500 truncate">{booking.guestEmail}</p>
            </div>
          </div>
        );
      },
    }),

    // 2. Listing Title
    columnHelper.accessor("listingTitle", {
      header: "Listing",
      cell: (info) => {
        const booking = info.row.original;
        return (
          <div className="flex items-center gap-2.5 min-w-[200px] max-w-[280px]">
            <img
              src={booking.listingThumbnail}
              alt={booking.listingTitle}
              className="h-9 w-12 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <span className="text-xs font-medium text-slate-800 line-clamp-2">
              {booking.listingTitle}
            </span>
          </div>
        );
      },
    }),

    // 3. Dates
    columnHelper.accessor("checkIn", {
      header: "Stay Dates",
      cell: (info) => {
        const booking = info.row.original;
        return (
          <div className="text-xs text-slate-700 whitespace-nowrap">
            <div className="flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {booking.checkIn} to {booking.checkOut}
            </div>
            <span className="text-[11px] text-slate-500">{booking.nights} nights</span>
          </div>
        );
      },
    }),

    // 4. Guests Count
    columnHelper.accessor("guestsCount", {
      header: "Guests",
      cell: (info) => (
        <div className="flex items-center gap-1 text-xs text-slate-700 font-medium whitespace-nowrap">
          <User className="h-3.5 w-3.5 text-slate-400" />
          {info.getValue()} {info.getValue() === 1 ? "guest" : "guests"}
        </div>
      ),
    }),

    // 5. Total Amount
    columnHelper.accessor("totalAmount", {
      header: "Amount",
      cell: (info) => (
        <div className="text-sm font-bold text-slate-900 whitespace-nowrap">
          ${info.getValue().toLocaleString()}
        </div>
      ),
    }),

    // 6. Status Badge
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        let badgeStyle = "bg-slate-100 text-slate-600 border-slate-200";

        if (status === "PENDING") {
          badgeStyle = "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";
        } else if (status === "CONFIRMED") {
          badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
        } else if (status === "COMPLETED") {
          badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
        } else if (status === "CANCELLED") {
          badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
        }

        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${badgeStyle}`}
          >
            {status}
          </span>
        );
      },
    }),

    // 7. Actions (Confirm / Decline for PENDING)
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: (info) => {
        const booking = info.row.original;
        if (booking.status === "PENDING") {
          return (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <button
                type="button"
                onClick={() => onConfirmBooking(booking.id)}
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition"
              >
                <Check className="h-3.5 w-3.5" /> Confirm
              </button>
              <button
                type="button"
                onClick={() => onDeclineBooking(booking.id)}
                className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition"
              >
                <X className="h-3.5 w-3.5" /> Decline
              </button>
            </div>
          );
        }

        return (
          <span className="text-xs text-slate-400 italic whitespace-nowrap">
            No action needed
          </span>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Recent Bookings{" "}
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 font-semibold">
              {filteredData.length}
            </span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Review incoming requests, confirmed trips, and booking statuses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="relative flex items-center">
            <Filter className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-full border border-slate-200 bg-slate-50/50 pl-9 pr-8 text-xs font-semibold text-slate-700 focus:border-[#FF385C] focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Only</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search guest or listing..."
              className="h-10 w-full sm:w-52 rounded-full border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#FF385C] focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* TanStack Table Element */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="py-3 px-3 first:pl-1 last:pr-1">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <th key={cell.id} className="py-3.5 px-3 first:pl-1 last:pr-1 font-normal">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </th>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-slate-500">
                  <Inbox className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  No bookings found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
