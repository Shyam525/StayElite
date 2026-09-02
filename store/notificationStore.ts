import { create } from "zustand";
import {
  fetchNotifications,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "@/services/notificationService";
import type { NotificationItem } from "@/types/notification";

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  isPolling: boolean;
  pollIntervalId: NodeJS.Timeout | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isPolling: false,
  pollIntervalId: null,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchNotifications(1, 15);
      set({
        notifications: data.notifications || [],
        unreadCount: data.unreadCount || 0,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    const { notifications, unreadCount } = get();

    // Optimistic update
    const updated = notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    const newUnread = Math.max(0, unreadCount - 1);
    set({ notifications: updated, unreadCount: newUnread });

    // Call API
    await markNotificationReadApi(id);
  },

  markAllAsRead: async () => {
    const { notifications } = get();

    // Optimistic update
    const updated = notifications.map((n) => ({ ...n, is_read: true }));
    set({ notifications: updated, unreadCount: 0 });

    // Call API
    await markAllNotificationsReadApi();
  },

  startPolling: () => {
    const { isPolling, pollIntervalId, fetchNotifications: load } = get();
    if (isPolling) return;

    // Load initial
    void load();

    // Set 30-second interval poll
    const interval = setInterval(() => {
      void load();
    }, 30000);

    set({ isPolling: true, pollIntervalId: interval });
  },

  stopPolling: () => {
    const { pollIntervalId } = get();
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
    }
    set({ isPolling: false, pollIntervalId: null });
  },
}));
