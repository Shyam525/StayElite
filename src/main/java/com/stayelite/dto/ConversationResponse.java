package com.stayelite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private String conversationKey;
    private UUID otherUserId;
    private String otherUserName;
    private String otherUserAvatarUrl;
    private UUID listingId;
    private String listingTitle;
    private String listingPhotoUrl;
    private MessageResponse lastMessage;
    private long unreadCount;
}
