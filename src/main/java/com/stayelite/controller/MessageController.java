package com.stayelite.controller;

import com.stayelite.common.ApiResponse;
import com.stayelite.dto.ConversationResponse;
import com.stayelite.dto.MessageResponse;
import com.stayelite.dto.SendMessageRequest;
import com.stayelite.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @Valid @RequestBody SendMessageRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Message sent successfully",
                messageService.sendMessage(request, userDetails.getUsername())));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<ConversationResponse>>> listConversations(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Conversations fetched successfully",
                messageService.getConversations(userDetails.getUsername())));
    }

    @GetMapping("/conversations/{conversationKey}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getConversation(
            @PathVariable String conversationKey,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Conversation fetched successfully",
                messageService.getConversation(conversationKey, userDetails.getUsername())));
    }

    @PutMapping("/conversations/{conversationKey}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable String conversationKey,
            @AuthenticationPrincipal UserDetails userDetails) {
        messageService.markConversationRead(conversationKey, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Conversation marked as read", null));
    }
}
