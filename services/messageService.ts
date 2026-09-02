import api from "@/lib/axios";

export type Conversation = {
  conversationKey: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatarUrl?: string;
  listingId: string;
  listingTitle: string;
  listingPhotoUrl?: string;
  lastMessage: MessageItem;
  unreadCount: number;
};

export type MessageItem = {
  id: number;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
};

export type UserPresence = {
  isOnline: boolean;
  lastSeen: string;
  timestamp?: number;
};

function unwrap<T>(response: { data?: { data?: T } | T }) {
  const body = response.data;
  return (body && typeof body === "object" && "data" in body ? body.data : body) as T;
}

export async function getConversations() {
  return unwrap<Conversation[]>(await api.get("/messages/conversations"));
}

export async function getConversation(key: string) {
  return unwrap<MessageItem[]>(await api.get(`/messages/conversations/${encodeURIComponent(key)}`));
}

export async function markConversationRead(key: string) {
  return unwrap(await api.put(`/messages/conversations/${encodeURIComponent(key)}/read`));
}

export async function sendMessage(payload: { receiverId: string; listingId: string; content: string }) {
  return unwrap<MessageItem>(await api.post("/messages", payload));
}

export async function getUserPresence(userId: string): Promise<UserPresence> {
  try {
    const res = await api.get(`/messages/presence/${userId}`);
    return unwrap<UserPresence>(res);
  } catch {
    return { isOnline: true, lastSeen: "Online" };
  }
}
