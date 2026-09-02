import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = Number(price) || 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDateRange(startDateStr?: string | null, endDateStr?: string | null): string {
  if (!startDateStr && !endDateStr) return "Dec 3–8";
  if (!startDateStr) return "Flexible dates";
  try {
    const start = new Date(startDateStr);
    const end = endDateStr ? new Date(endDateStr) : new Date(start.getTime() + 5 * 24 * 60 * 60 * 1000);
    const startMonth = start.toLocaleDateString("en-US", { month: "short" });
    const endMonth = end.toLocaleDateString("en-US", { month: "short" });
    const startDay = start.getDate();
    const endDay = end.getDate();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay}–${endDay}`;
    }
    return `${startMonth} ${startDay}–${endMonth} ${endDay}`;
  } catch {
    return "Available dates";
  }
}
