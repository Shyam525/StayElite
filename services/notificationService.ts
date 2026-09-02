import api from "@/lib/axios";
import type { NotificationItem, NotificationsResponse } from "@/types/notification";

export async function fetchNotifications(page = 1, size = 10): Promise<NotificationsResponse> {
  try {
    const response = await api.get("/notifications", { params: { page, size } });
    return response.data?.data || response.data;
  } catch (error) {
    console.warn("API GET /notifications failed, returning fallback notifications.");
    return {
      notifications: [],
      unreadCount: 0,
      total: 0,
      page: 1,
      pageSize: size,
    };
  }
}

export async function markNotificationReadApi(id: string): Promise<void> {
  try {
    await api.post(`/notifications/mark-read/${id}`);
  } catch (error) {
    console.warn(`API POST /notifications/mark-read/${id} failed.`);
  }
}

export async function markAllNotificationsReadApi(): Promise<void> {
  try {
    await api.post("/notifications/mark-all-read");
  } catch (error) {
    console.warn("API POST /notifications/mark-all-read failed.");
  }
}

// Service helper to trigger notifications on events (e.g. new booking, review, payment, message)
export function triggerNotificationEvent(payload: Omit<NotificationItem, "id" | "created_at" | "is_read">) {
  const newNotif: NotificationItem = {
    id: `notif-${Date.now()}`,
    is_read: false,
    created_at: new Date().toISOString(),
    ...payload,
  };
  return newNotif;
}
