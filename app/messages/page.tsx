"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  MessageCircle,
  Send,
  X,
  Check,
  CheckCheck,
  Wifi,
  WifiOff,
} from "lucide-react";
import {
  getConversation,
  getConversations,
  getUserPresence,
  markConversationRead,
  sendMessage,
  type Conversation,
  type MessageItem,
} from "@/services/messageService";
import { useAuthStore } from "@/store/authStore";
import { useChatSocket } from "@/hooks/useChatSocket";

function Avatar({
  name,
  src,
  small = false,
  isOnline = false,
}: {
  name: string;
  src?: string;
  small?: boolean;
  isOnline?: boolean;
}) {
  return (
    <div className="relative inline-block shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${small ? "h-9 w-9" : "h-11 w-11"} rounded-full object-cover border border-slate-200`}
        />
      ) : (
        <div
          className={`${
            small ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm"
          } flex items-center justify-center rounded-full bg-rose-100 font-semibold text-[#FF385C]`}
        >
          {name?.charAt(0) || "S"}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </div>
  );
}

function timeLabel(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const currentUser = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch conversations (NO 5-second REST polling; real-time via WebSocket!)
  const conversations = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
    refetchInterval: false,
  });

  const selected =
    conversations.data?.find((item) => item.conversationKey === selectedKey) || null;

  // 2. Fetch conversation thread (NO 5-second REST polling)
  const thread = useQuery({
    queryKey: ["conversation", selectedKey],
    queryFn: () => getConversation(selectedKey as string),
    enabled: Boolean(selectedKey),
    refetchInterval: false,
  });

  // 3. Presence query for selected user
  const presenceQuery = useQuery({
    queryKey: ["presence", selected?.otherUserId],
    queryFn: () => getUserPresence(selected?.otherUserId as string),
    enabled: Boolean(selected?.otherUserId),
    refetchInterval: 15000, // Light status check every 15s
  });

  // 4. Connect STOMP WebSocket Hook
  const { isConnected, isOtherUserTyping, sendMessageViaSocket, sendTypingSignal } =
    useChatSocket({
      activeConversationKey: selectedKey,
      receiverId: selected?.otherUserId,
    });

  // Send message mutation (HTTP REST fallback or WS echo)
  const send = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setDraft("");
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      void queryClient.invalidateQueries({ queryKey: ["conversation", selectedKey] });
    },
  });

  const contactTarget = useMemo(
    () => ({
      listingId: searchParams.get("listingId"),
      hostId: searchParams.get("hostId"),
    }),
    [searchParams]
  );

  useEffect(() => {
    if (!selectedKey && !contactTarget.listingId && conversations.data?.length) {
      setSelectedKey(conversations.data[0].conversationKey);
    }
  }, [conversations.data, contactTarget.listingId, selectedKey]);

  useEffect(() => {
    const initialMessage = searchParams.get("message");
    if (initialMessage && !draft) setDraft(initialMessage);
  }, [draft, searchParams]);

  useEffect(() => {
    if (selectedKey) {
      void markConversationRead(selectedKey).then(() =>
        queryClient.invalidateQueries({ queryKey: ["conversations"] })
      );
    }
  }, [queryClient, selectedKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.data, isOtherUserTyping]);

  // Handle typing input
  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDraft(text);

    if (selected?.otherUserId) {
      sendTypingSignal(selected.otherUserId, true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        sendTypingSignal(selected.otherUserId, false);
      }, 2000);
    }
  };

  const sendCurrent = () => {
    const content = draft.trim();
    if (!content) return;

    const target =
      selected ||
      (contactTarget.listingId && contactTarget.hostId
        ? { listingId: contactTarget.listingId, otherUserId: contactTarget.hostId }
        : null);

    if (!target) return;

    // Send typing stop signal
    if (target.otherUserId) {
      sendTypingSignal(target.otherUserId, false);
    }

    // Try WebSocket send first, fallback to HTTP REST
    const sentViaWs = sendMessageViaSocket({
      receiverId: target.otherUserId,
      listingId: target.listingId,
      content,
    });

    if (sentViaWs) {
      setDraft("");
      // Optimistically append to thread
      const optimisticMsg: MessageItem = {
        id: Date.now(),
        senderId: currentUser?.id || "me",
        senderName: currentUser?.fullName || "Me",
        receiverId: target.otherUserId,
        content,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<MessageItem[]>(
        ["conversation", selectedKey],
        (old) => (old ? [...old, optimisticMsg] : [optimisticMsg])
      );
    } else {
      send.mutate({
        receiverId: target.otherUserId,
        listingId: target.listingId,
        content,
      });
    }
  };

  const showThread = Boolean(selected || (contactTarget.listingId && contactTarget.hostId));

  return (
    <main className="mx-auto flex h-[calc(100vh-200px)] min-h-[600px] max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
      {/* Sidebar - Conversation List */}
      <aside
        className={`w-full border-r border-slate-200 md:w-[360px] ${
          showThread ? "hidden md:flex md:flex-col" : "flex flex-col"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FF385C]">
              StayElite Inbox
            </span>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Messages
            </h1>
          </div>

          {/* WebSocket Status Pill */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              isConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
            title={isConnected ? "Real-time WebSocket active" : "Reconnecting STOMP..."}
          >
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 text-emerald-600 animate-pulse" /> Live
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-amber-600" /> Connecting...
              </>
            )}
          </div>
        </div>

        {/* Conversations Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.isLoading && (
            <div className="flex items-center gap-2 p-6 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#FF385C]" /> Loading conversations...
            </div>
          )}

          {!conversations.isLoading && !conversations.data?.length && (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-800">No messages yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Contact a host from a listing page to start a conversation.
              </p>
            </div>
          )}

          {conversations.data?.map((conversation) => (
            <button
              type="button"
              key={conversation.conversationKey}
              onClick={() => setSelectedKey(conversation.conversationKey)}
              className={`flex w-full gap-3.5 p-4 text-left transition hover:bg-slate-50 ${
                selectedKey === conversation.conversationKey
                  ? "bg-rose-50/60 border-l-4 border-[#FF385C]"
                  : ""
              }`}
            >
              <Avatar
                name={conversation.otherUserName}
                src={conversation.otherUserAvatarUrl}
                isOnline={true}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <strong className="truncate text-sm font-bold text-slate-900">
                    {conversation.otherUserName}
                  </strong>
                  <time className="shrink-0 text-[11px] font-medium text-slate-400">
                    {timeLabel(conversation.lastMessage.createdAt)}
                  </time>
                </div>
                <span className="mt-0.5 block truncate text-xs font-semibold text-[#FF385C]">
                  {conversation.listingTitle}
                </span>
                <span className="mt-1 block truncate text-xs text-slate-600">
                  {conversation.lastMessage.content}
                </span>
              </div>
              {conversation.unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF385C] px-1 text-[10px] font-bold text-white shadow-xs">
                  {conversation.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Conversation Chat Screen */}
      <section
        className={`flex min-w-0 flex-1 flex-col ${
          showThread ? "flex" : "hidden md:flex"
        }`}
      >
        {showThread ? (
          <>
            {/* Active Thread Header */}
            <header className="flex items-center justify-between border-b border-slate-200 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedKey(null)}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 md:hidden"
                >
                  <X className="h-5 w-5" />
                </button>
                <Avatar
                  name={selected?.otherUserName || "Host"}
                  src={selected?.otherUserAvatarUrl}
                  small
                  isOnline={presenceQuery.data?.isOnline}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {selected?.otherUserName || "Host"}
                    </p>
                    <span
                      className={`h-2 w-2 rounded-full ${
                        presenceQuery.data?.isOnline ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                    <span className="text-[11px] font-medium text-slate-500">
                      {presenceQuery.data?.lastSeen || "Online"}
                    </span>
                  </div>
                  <p className="truncate text-xs text-slate-500 font-medium">
                    {selected?.listingTitle || "StayElite Stay"}
                  </p>
                </div>
              </div>
            </header>

            {/* Message History Thread */}
            <div className="flex-1 space-y-3.5 overflow-y-auto bg-slate-50/70 p-4 sm:p-6">
              {thread.isLoading && selectedKey && (
                <div className="flex items-center justify-center py-8 text-xs text-slate-500">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#FF385C]" /> Loading message thread...
                </div>
              )}

              {thread.data?.map((message: MessageItem) => {
                const isMine = message.senderId === currentUser?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                        isMine
                          ? "rounded-br-xs bg-slate-900 text-white"
                          : "rounded-bl-xs border border-slate-200/80 bg-white text-slate-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>

                      <div
                        className={`mt-1.5 flex items-center justify-end gap-1.5 text-[10px] ${
                          isMine ? "text-slate-400" : "text-slate-400"
                        }`}
                      >
                        <time>
                          {new Date(message.createdAt).toLocaleTimeString(undefined, {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </time>

                        {/* Delivery Tick Marks for my messages */}
                        {isMine && (
                          <span title={message.isRead ? "Read" : "Sent"}>
                            {message.isRead ? (
                              <CheckCheck className="h-3.5 w-3.5 text-sky-400" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isOtherUserTyping && (
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 animate-pulse py-1">
                  <div className="flex gap-1 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>{selected?.otherUserName || "Host"} is typing...</span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input Footer */}
            <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
              <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-2 focus-within:border-[#FF385C] focus-within:bg-white transition">
                <textarea
                  value={draft}
                  onChange={handleDraftChange}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendCurrent();
                    }
                  }}
                  rows={1}
                  placeholder="Write a message..."
                  className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={sendCurrent}
                  disabled={send.isPending || !draft.trim()}
                  aria-label="Send message"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FF385C] text-white transition hover:bg-[#e42d4d] disabled:opacity-40 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              {send.isError && (
                <p className="mt-2 text-xs text-rose-600">
                  Message could not be sent. Please try again.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="h-12 w-12 text-slate-200 mb-3" />
            <h2 className="text-xl font-bold text-slate-900">Your Conversations</h2>
            <p className="mt-1 max-w-xs text-xs text-slate-500">
              Select a conversation from the left to start real-time messaging with your host or guests.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[580px] items-center justify-center text-sm text-slate-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#FF385C]" /> Loading real-time messaging...
        </div>
      }
    >
      <MessagesPageContent />
    </Suspense>
  );
}
