"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuthStore } from "@/store/authStore";
import type { MessageItem } from "@/services/messageService";

interface UseChatSocketOptions {
  activeConversationKey?: string | null;
  receiverId?: string | null;
}

export function useChatSocket(options?: UseChatSocketOptions) {
  const { activeConversationKey, receiverId } = options || {};
  const queryClient = useQueryClient();
  const { user, accessToken } = useAuthStore();
  const stompClientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getWsUrl = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    return apiBase.replace(/\/api$/, "/ws");
  };

  useEffect(() => {
    if (!user || !accessToken) return;

    const wsUrl = getWsUrl();
    const currentUserId = user.id;

    // Create STOMP Client over SockJS with exponential backoff reconnect
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
        token: accessToken,
      },
      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("[STOMP Debug]", str);
        }
      },
      reconnectDelay: 5000, // Exponential backoff reconnect interval
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
    });

    client.onConnect = () => {
      setIsConnected(true);
      console.log("WebSocket STOMP connected cleanly!");

      // 1. Subscribe to private user message queue
      client.subscribe(`/queue/messages/${currentUserId}`, (message: IMessage) => {
        handleIncomingMessage(message);
      });

      client.subscribe(`/user/queue/messages`, (message: IMessage) => {
        handleIncomingMessage(message);
      });

      // 2. Subscribe to typing indicators
      client.subscribe(`/queue/typing/${currentUserId}`, (message: IMessage) => {
        try {
          const payload = JSON.parse(message.body);
          if (payload.isTyping) {
            setIsOtherUserTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              setIsOtherUserTyping(false);
            }, 3000);
          } else {
            setIsOtherUserTyping(false);
          }
        } catch (e) {
          console.error("Failed to parse STOMP typing payload", e);
        }
      });
    };

    client.onStompError = (frame) => {
      console.warn("STOMP Error header:", frame.headers["message"]);
      console.warn("STOMP Error body:", frame.body);
      setIsConnected(false);
    };

    client.onWebSocketClose = () => {
      setIsConnected(false);
    };

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      void client.deactivate();
      stompClientRef.current = null;
      setIsConnected(false);
    };
  }, [user, accessToken]);

  const handleIncomingMessage = (stompMsg: IMessage) => {
    try {
      const newMsg: MessageItem = JSON.parse(stompMsg.body);

      // Invalidate React Query cache to immediately update conversations and message threads
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      if (activeConversationKey) {
        void queryClient.invalidateQueries({ queryKey: ["conversation", activeConversationKey] });
      }

      // Optimistically append to current conversation thread in React Query cache if active
      queryClient.setQueriesData<MessageItem[]>(
        { queryKey: ["conversation"] },
        (oldData) => {
          if (!oldData) return [newMsg];
          if (oldData.some((m) => m.id === newMsg.id)) return oldData;
          return [...oldData, newMsg];
        }
      );
    } catch (err) {
      console.error("Failed to parse incoming WS STOMP message payload", err);
    }
  };

  // Helper to send message via STOMP /app/chat.send
  const sendMessageViaSocket = useCallback(
    (payload: { receiverId: string; listingId: string; content: string }) => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(payload),
        });
        return true;
      }
      return false;
    },
    []
  );

  // Helper to emit typing signal via STOMP /app/chat.typing
  const sendTypingSignal = useCallback(
    (targetReceiverId: string, isTyping: boolean) => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: "/app/chat.typing",
          body: JSON.stringify({
            receiverId: targetReceiverId,
            senderId: user?.id,
            isTyping,
          }),
        });
      }
    },
    [user?.id]
  );

  return {
    isConnected,
    isOtherUserTyping,
    sendMessageViaSocket,
    sendTypingSignal,
  };
}
