"use client";

import { DollarSign, CalendarDays, Star, Clock, ArrowUpRight, TrendingUp, Sparkles } from "lucide-react";
import type { HostStats } from "@/types/host";

interface StatsOverviewProps {
  stats: HostStats;
  onFilterPending?: () => void;
}

export function StatsOverview({ stats, onFilterPending }: StatsOverviewProps) {
  const occupancyPercentage = Math.round(stats.occupancyRate * 100);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Earnings */}
      <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Earnings (This Month)
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-110">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            ${stats.totalEarningsThisMonth.toLocaleString()}
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +{stats.earningsGrowthPercent}%
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Sum of completed bookings in Sept
        </p>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* 2. Occupancy Rate */}
      <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Occupancy Rate
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-[#FF385C] transition-transform duration-300 group-hover:scale-110">
            <CalendarDays className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {occupancyPercentage}%
          </p>
          <span className="text-xs text-slate-500 font-medium">
            {stats.totalNightsBooked} / {stats.totalAvailableNights} nights
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FF385C] to-rose-400 transition-all duration-500"
            style={{ width: `${occupancyPercentage}%` }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#FF385C] to-rose-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* 3. Reviews & Rating */}
      <div className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Rating & Reviews
          </span>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 transition-transform duration-300 group-hover:scale-110">
            <Star className="h-5 w-5 fill-amber-400" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {stats.averageRating}
          </p>
          <span className="text-sm font-semibold text-slate-500">★</span>
          <span className="text-xs font-medium text-slate-500">
            ({stats.totalReviews} total reviews)
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50/80 rounded-lg px-2.5 py-1 w-fit">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Guest Favorite Host Badge
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* 4. Pending Bookings */}
      <div
        onClick={onFilterPending}
        className={`group relative cursor-pointer overflow-hidden rounded-3xl border transition-all duration-300 p-6 shadow-sm ${
          stats.pendingBookingsCount > 0
            ? "border-amber-300/80 bg-gradient-to-br from-amber-50/50 via-white to-white hover:border-amber-400 hover:shadow-md"
            : "border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pending Actions
          </span>
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
              stats.pendingBookingsCount > 0
                ? "bg-amber-100 text-amber-700 animate-pulse"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <Clock className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <p className="text-3xl font-bold tracking-tight text-slate-900">
            {stats.pendingBookingsCount}
          </p>
          {stats.pendingBookingsCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
              Needs Action
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              All Clear
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {stats.pendingBookingsCount > 0
            ? `${stats.pendingBookingsCount} booking requests waiting for confirmation`
            : "No pending requests at this moment"}
        </p>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </div>
  );
}
