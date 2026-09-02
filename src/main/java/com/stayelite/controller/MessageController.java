package com.stayelite.controller;

import com.stayelite.common.ApiResponse;
import com.stayelite.dto.ConversationResponse;
import com.stayelite.dto.MessageResponse;
import com.stayelite.dto.SendMessageRequest;
import com.stayelite.service.MessageService;
import com.stayelite.service.PresenceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate;

    @ResponseBody
    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        MessageResponse response = messageService.sendMessage(request, userDetails.getUsername());

        // Send via WebSocket to receiver queue
        try {
            messagingTemplate.convertAndSend("/queue/messages/" + request.getReceiverId(), response);
            messagingTemplate.convertAndSendToUser(request.getReceiverId().toString(), "/queue/messages", response);
        } catch (Exception e) {
            log.warn("Could not dispatch real-time WebSocket message to receiver: {}", request.getReceiverId(), e);
        }

        return ResponseEntity.ok(ApiResponse.success("Message sent successfully", response));
    }

    // 1. WebSocket STOMP handler for /app/chat.send
    @MessageMapping("/chat.send")
    public void processChatMessage(@Payload SendMessageRequest request, Principal principal) {
        if (principal == null) {
            log.warn("Unauthenticated WebSocket message payload received");
            return;
        }

        MessageResponse savedMessage = messageService.sendMessage(request, principal.getName());

        // Send private message to receiver
        messagingTemplate.convertAndSend("/queue/messages/" + request.getReceiverId(), savedMessage);
        messagingTemplate.convertAndSendToUser(request.getReceiverId().toString(), "/queue/messages", savedMessage);
        
        // Send echo back to sender for confirmation
        messagingTemplate.convertAndSend("/queue/messages/" + savedMessage.getSenderId(), savedMessage);
    }

    // 2. WebSocket STOMP handler for typing indicator /app/chat.typing
    @MessageMapping("/chat.typing")
    public void processTypingStatus(@Payload Map<String, Object> payload, Principal principal) {
        if (payload != null && payload.containsKey("receiverId")) {
            String receiverId = String.valueOf(payload.get("receiverId"));
            messagingTemplate.convertAndSend("/queue/typing/" + receiverId, payload);
        }
    }

    @ResponseBody
    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> listConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Conversations fetched successfully",
                messageService.getConversations(userDetails.getUsername())));
    }

    @ResponseBody
    @GetMapping("/conversations/{conversationKey}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getConversation(
            @PathVariable String conversationKey,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Conversation fetched successfully",
                messageService.getConversation(conversationKey, userDetails.getUsername())));
    }

    @ResponseBody
    @PutMapping("/conversations/{conversationKey}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String conversationKey,
            @AuthenticationPrincipal UserDetails userDetails) {
        messageService.markConversationRead(conversationKey, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Conversation marked as read", null));
    }

    @ResponseBody
    @GetMapping("/presence/{userId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPresence(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success("Presence status fetched", presenceService.getUserPresence(userId)));
    }
}
