import { NextResponse } from "next/server";
import type { NotificationItem } from "@/types/notification";

// Global in-memory notifications store with realistic default notifications
export let notificationsStore: NotificationItem[] = [
  {
    id: "notif-101",
    user_id: "user-current",
    type: "BOOKING_CONFIRMED",
    title: "Booking Confirmed! 🎉",
    message: "Your stay at Luxury Oceanfront Villa in Malibu for Sep 12-16 is confirmed.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    link: "/trips",
  },
  {
    id: "notif-102",
    user_id: "user-current",
    type: "NEW_MESSAGE",
    title: "New Message from Host",
    message: "Sophia sent you check-in instructions and the front gate door code.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    link: "/messages",
  },
  {
    id: "notif-103",
    user_id: "user-current",
    type: "PAYMENT_RECEIVED",
    title: "Payout Disbursed ($1,800.00)",
    message: "Payout for booking #BK-901 has been transferred to your bank account.",
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(), // 10 hours ago
    link: "/host/dashboard",
  },
  {
    id: "notif-104",
    user_id: "user-current",
    type: "NEW_REVIEW",
    title: "5-Star Review Received ★★★★★",
    message: "Emma left a glowing review for Modern Skyline Penthouse: 'Absolutely stunning view!'",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // 1 day ago
    link: "/host/dashboard",
  },
  {
    id: "notif-105",
    user_id: "user-current",
    type: "BOOKING_CANCELLED",
    title: "Reservation Cancelled",
    message: "Alexander cancelled booking #BK-907 for Cozy Alpine Timber Chalet.",
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    link: "/host/dashboard",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);

  // Sort: unread first, then newest created_at
  const sorted = [...notificationsStore].sort((a, b) => {
    if (a.is_read !== b.is_read) return a.is_read ? 1 : -1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const unreadCount = notificationsStore.filter((n) => !n.is_read).length;
  const startIndex = (page - 1) * size;
  const paginated = sorted.slice(startIndex, startIndex + size);

  return NextResponse.json({
    success: true,
    data: {
      notifications: paginated,
      unreadCount,
      total: notificationsStore.length,
      page,
      pageSize: size,
    },
  });
}
