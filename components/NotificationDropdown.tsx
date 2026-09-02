"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Star,
  MessageSquare,
  DollarSign,
  CheckCheck,
  ExternalLink,
  Clock,
  Sparkles,
} from "lucide-react";
import { useNotificationStore } from "@/store/notificationStore";
import type { NotificationItem, NotificationType } from "@/types/notification";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "BOOKING_CONFIRMED":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    case "BOOKING_CANCELLED":
      return <XCircle className="h-4 w-4 text-rose-600" />;
    case "NEW_REVIEW":
      return <Star className="h-4 w-4 text-amber-500 fill-amber-400" />;
    case "NEW_MESSAGE":
      return <MessageSquare className="h-4 w-4 text-sky-600" />;
    case "PAYMENT_RECEIVED":
      return <DollarSign className="h-4 w-4 text-emerald-600" />;
    default:
      return <Sparkles className="h-4 w-4 text-purple-600" />;
  }
}

function getNotificationBg(type: NotificationType) {
  switch (type) {
    case "BOOKING_CONFIRMED":
      return "bg-emerald-50";
    case "BOOKING_CANCELLED":
      return "bg-rose-50";
    case "NEW_REVIEW":
      return "bg-amber-50";
    case "NEW_MESSAGE":
      return "bg-sky-50";
    case "PAYMENT_RECEIVED":
      return "bg-emerald-50";
    default:
      return "bg-purple-50";
  }
}

function timeAgo(dateString: string): string {
  const diffMs = new Date().getTime() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead, startPolling, stopPolling } =
    useNotificationStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View notifications"
        className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100 focus:outline-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF385C] px-1 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 z-50 w-80 sm:w-96 rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold text-[#FF385C]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900 transition"
              >
                <CheckCheck className="h-3.5 w-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="mt-2 max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.slice(0, 6).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => void handleNotificationClick(notif)}
                  className={`group flex cursor-pointer items-start gap-3 p-2.5 transition rounded-2xl ${
                    !notif.is_read ? "bg-slate-50/80 hover:bg-slate-100/80" : "hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${getNotificationBg(
                      notif.type
                    )}`}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-1">
                      <p
                        className={`text-xs ${
                          !notif.is_read ? "font-bold text-slate-900" : "font-medium text-slate-700"
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {timeAgo(notif.created_at)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>

                  {!notif.is_read && (
                    <span className="h-2 w-2 rounded-full bg-[#FF385C] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                <Bell className="mx-auto h-6 w-6 text-slate-300 mb-1" />
                No notifications right now.
              </div>
            )}
          </div>

          {/* Footer Link */}
          <div className="mt-3 border-t border-slate-100 pt-2.5 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF385C] hover:underline"
            >
              See all notifications <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
