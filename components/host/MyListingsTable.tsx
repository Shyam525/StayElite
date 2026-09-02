"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Plus,
  Eye,
  Star,
  MoreVertical,
  Edit,
  ExternalLink,
  Power,
  Search,
  Building2,
} from "lucide-react";
import type { HostListing } from "@/types/host";

interface MyListingsTableProps {
  listings: HostListing[];
  onToggleStatus: (id: string) => void;
  onEditListing: (listing: HostListing) => void;
}

const columnHelper = createColumnHelper<HostListing>();

export function MyListingsTable({
  listings,
  onToggleStatus,
  onEditListing,
}: MyListingsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const columns = [
    // 1. Listing Thumbnail & Title
    columnHelper.accessor("title", {
      header: "Listing",
      cell: (info) => {
        const listing = info.row.original;
        return (
          <div className="flex items-center gap-3.5 py-1 min-w-[240px]">
            <img
              src={listing.thumbnail}
              alt={listing.title}
              className="h-14 w-16 rounded-2xl object-cover border border-slate-200/80 shadow-xs shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-slate-900 truncate hover:text-[#FF385C]">
                {listing.title}
              </h3>
              <p className="text-xs text-slate-500 truncate mt-0.5">{listing.location}</p>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                <span>{listing.bedrooms} beds</span> • <span>{listing.bathrooms} baths</span> • <span>Max {listing.maxGuests} guests</span>
              </div>
            </div>
          </div>
        );
      },
    }),

    // 2. Price / Night
    columnHelper.accessor("pricePerNight", {
      header: "Price / Night",
      cell: (info) => (
        <div className="font-semibold text-slate-900 text-sm whitespace-nowrap">
          ${info.getValue()} <span className="text-xs font-normal text-slate-500">/ night</span>
        </div>
      ),
    }),

    // 3. Status Toggle (Active / Inactive)
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const isActive = info.getValue() === "ACTIVE";
        const id = info.row.original.id;
        return (
          <div className="flex items-center gap-2 whitespace-nowrap">
            <button
              type="button"
              onClick={() => onToggleStatus(id)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isActive ? "bg-emerald-500" : "bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        );
      },
    }),

    // 4. Rating & Reviews
    columnHelper.accessor("rating", {
      header: "Rating",
      cell: (info) => {
        const rating = info.getValue();
        const reviewCount = info.row.original.reviewCount;
        return (
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-900 whitespace-nowrap">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {rating} <span className="text-xs font-normal text-slate-500">({reviewCount})</span>
          </div>
        );
      },
    }),

    // 5. Views Count (Placeholder metric)
    columnHelper.accessor("views", {
      header: "Views",
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 whitespace-nowrap">
          <Eye className="h-3.5 w-3.5 text-slate-400" />
          {info.getValue().toLocaleString()}
        </div>
      ),
    }),

    // 6. Actions
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const listing = info.row.original;
        const isOpen = openDropdownId === listing.id;

        return (
          <div className="relative flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => onEditListing(listing)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <Edit className="h-3.5 w-3.5" /> Edit
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenDropdownId(isOpen ? null : listing.id)}
                className="rounded-xl border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {isOpen && (
                <div
                  onMouseLeave={() => setOpenDropdownId(null)}
                  className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onEditListing(listing);
                      setOpenDropdownId(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Edit className="h-3.5 w-3.5 text-slate-500" /> Quick Edit Pricing
                  </button>

                  <Link
                    href={`/listings/${listing.id}`}
                    target="_blank"
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500" /> View Public Page
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      onToggleStatus(listing.id);
                      setOpenDropdownId(null);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    <Power className="h-3.5 w-3.5 text-slate-500" />
                    {listing.status === "ACTIVE" ? "Deactivate" : "Activate"}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: listings,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            My Listings <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 font-semibold">{listings.length}</span>
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Manage your properties, check guest ratings, and toggle availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search listings..."
              className="h-10 w-full sm:w-56 rounded-full border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#FF385C] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Add New Listing Button */}
          <Link href="/host/create-listing">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#FF385C] px-4 text-xs font-semibold text-white transition hover:bg-[#e42d4d] shadow-sm"
            >
              <Plus className="h-4 w-4" /> Add new listing
            </button>
          </Link>
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
                  <Building2 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  No listings found matching your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
