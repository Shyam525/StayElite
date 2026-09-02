"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import type { EarningsMonthData } from "@/types/host";

interface EarningsChartProps {
  data: EarningsMonthData[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  const [timeframe, setTimeframe] = useState<"6m" | "ytd">("6m");

  const totalEarnings = data.reduce((acc, d) => acc + d.earnings, 0);
  const avgMonthly = Math.round(totalEarnings / (data.length || 1));

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">Earnings Performance</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-[#FF385C]">
              <TrendingUp className="h-3 w-3" /> Last 6 Months
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total revenue: <span className="font-semibold text-slate-900">${totalEarnings.toLocaleString()}</span> • Avg per month: <span className="font-semibold text-slate-900">${avgMonthly.toLocaleString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-slate-100/80 p-1 text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setTimeframe("6m")}
            className={`rounded-full px-3 py-1.5 transition-all ${
              timeframe === "6m"
                ? "bg-white font-semibold text-slate-900 shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            Last 6 Months
          </button>
          <button
            type="button"
            onClick={() => setTimeframe("ytd")}
            className={`rounded-full px-3 py-1.5 transition-all ${
              timeframe === "ytd"
                ? "bg-white font-semibold text-slate-900 shadow-sm"
                : "hover:text-slate-900"
            }`}
          >
            Year to Date
          </button>
        </div>
      </div>

      <div className="mt-6 h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF385C" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#FF385C" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />

            <XAxis
              dataKey="shortMonth"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="earnings"
              stroke="#FF385C"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#earningsGradient)"
              activeDot={{
                r: 6,
                fill: "#FF385C",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data: EarningsMonthData = payload[0].payload;
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-900/95 p-3.5 shadow-xl text-white backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 text-xs font-semibold text-slate-400">
          <Calendar className="h-3.5 w-3.5 text-rose-400" />
          {data.month}
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-300">Earnings:</span>
            <span className="text-sm font-bold text-rose-400">${data.earnings.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-slate-300">Bookings:</span>
            <span className="text-xs font-medium text-slate-200">{data.completedBookings} completed</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
