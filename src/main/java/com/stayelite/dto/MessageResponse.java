package com.stayelite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private Long id;
    private UUID senderId;
    private String senderName;
    private String senderAvatarUrl;
    private UUID receiverId;
    private String content;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
