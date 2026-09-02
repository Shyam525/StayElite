"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  DollarSign,
  ExternalLink,
  Clock,
  Inbox,
  Sparkles,
} from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import type { NotificationItem, NotificationType } from "@/types/notification";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "BOOKING_CONFIRMED":
      return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
    case "BOOKING_CANCELLED":
      return <XCircle className="h-5 w-5 text-rose-600" />;
    case "NEW_REVIEW":
      return <Star className="h-5 w-5 text-amber-500 fill-amber-400" />;
    case "NEW_MESSAGE":
      return <MessageSquare className="h-5 w-5 text-sky-600" />;
    case "PAYMENT_RECEIVED":
      return <DollarSign className="h-5 w-5 text-emerald-600" />;
    default:
      return <Sparkles className="h-5 w-5 text-purple-600" />;
  }
}

function getNotificationBg(type: NotificationType) {
  switch (type) {
    case "BOOKING_CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "BOOKING_CANCELLED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "NEW_REVIEW":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "NEW_MESSAGE":
      return "bg-sky-50 text-sky-700 border-sky-200";
    case "PAYMENT_RECEIVED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-purple-50 text-purple-700 border-purple-200";
  }
}

function timeAgo(dateString: string): string {
  const diffMs = new Date().getTime() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
}

export default function NotificationsPage() {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
    useNotificationStore();
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const displayedNotifications = notifications.filter((n) => {
    if (filter === "UNREAD") return !n.is_read;
    return true;
  });

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#FF385C]" />
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Notification Center
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            Stay up to date with reservation updates, host messages, guest reviews, and payouts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => void markAllAsRead()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4 text-emerald-600" /> Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFilter("ALL")}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            filter === "ALL"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:text-slate-900"
          }`}
        >
          All Notifications ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("UNREAD")}
          className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
            filter === "UNREAD"
              ? "bg-slate-900 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:text-slate-900"
          }`}
        >
          Unread Only ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="mt-6 space-y-3">
        {displayedNotifications.length > 0 ? (
          displayedNotifications.map((notif) => (
            <article
              key={notif.id}
              className={`group flex items-start justify-between gap-4 rounded-3xl border p-5 transition-all duration-200 ${
                !notif.is_read
                  ? "border-rose-100 bg-rose-50/20 shadow-xs"
                  : "border-slate-200/80 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${getNotificationBg(
                    notif.type
                  )}`}
                >
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                    {!notif.is_read && (
                      <span className="inline-flex items-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-[#FF385C]">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                  <p className="mt-2 text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo(notif.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!notif.is_read && (
                  <button
                    type="button"
                    onClick={() => void markAsRead(notif.id)}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Mark as read"
                  >
                    <CheckCheck className="h-4 w-4" />
                  </button>
                )}

                {notif.link && (
                  <Link href={notif.link}>
                    <button
                      type="button"
                      onClick={() => {
                        if (!notif.is_read) void markAsRead(notif.id);
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </button>
                  </Link>
                )}
              </div>
            </article>
          ))
        ) : (
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-200 bg-white">
            <Inbox className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h2 className="text-base font-bold text-slate-800">No notifications found</h2>
            <p className="mt-1 text-xs text-slate-500">
              {filter === "UNREAD"
                ? "You have marked all notifications as read."
                : "You don't have any notifications right now."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
