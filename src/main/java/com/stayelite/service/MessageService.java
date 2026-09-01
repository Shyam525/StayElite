package com.stayelite.service;

import com.stayelite.dto.ConversationResponse;
import com.stayelite.dto.MessageResponse;
import com.stayelite.dto.SendMessageRequest;
import com.stayelite.entity.Listing;
import com.stayelite.entity.ListingPhoto;
import com.stayelite.entity.Message;
import com.stayelite.entity.User;
import com.stayelite.repository.ListingPhotoRepository;
import com.stayelite.repository.ListingRepository;
import com.stayelite.repository.MessageRepository;
import com.stayelite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private static final String KEY_SEPARATOR = "_";

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final ListingPhotoRepository listingPhotoRepository;

    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request, String email) {
        User sender = findUser(email);
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));
        Listing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("You cannot send a message to yourself");
        }

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .listing(listing)
                .content(request.getContent().trim())
                .isRead(false)
                .build();
        return toResponse(messageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversations(String email) {
        User currentUser = findUser(email);
        List<Message> messages = allMessagesFor(currentUser.getId());
        Map<String, List<Message>> grouped = messages.stream()
            .filter(message -> message.getListing() != null)
                .collect(Collectors.groupingBy(message -> conversationKey(message.getSender().getId(), message.getReceiver().getId(), message.getListing().getId())));

        return grouped.entrySet().stream()
                .map(entry -> toConversation(entry.getKey(), entry.getValue(), currentUser.getId()))
                .sorted(Comparator.comparing((ConversationResponse conversation) -> conversation.getLastMessage().getCreatedAt()).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MessageResponse> getConversation(String conversationKey, String email) {
        User currentUser = findUser(email);
        ConversationParticipants participants = parseKey(conversationKey);
        if (!participants.firstUserId().equals(currentUser.getId()) && !participants.secondUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You cannot access this conversation");
        }
        return allMessagesFor(currentUser.getId()).stream()
                .filter(message -> message.getListing() != null && message.getListing().getId().equals(participants.listingId()))
                .filter(message -> (message.getSender().getId().equals(participants.firstUserId()) && message.getReceiver().getId().equals(participants.secondUserId()))
                        || (message.getSender().getId().equals(participants.secondUserId()) && message.getReceiver().getId().equals(participants.firstUserId())))
                .sorted(Comparator.comparing(Message::getCreatedAt))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void markConversationRead(String conversationKey, String email) {
        User currentUser = findUser(email);
        ConversationParticipants participants = parseKey(conversationKey);
        if (!participants.firstUserId().equals(currentUser.getId()) && !participants.secondUserId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You cannot access this conversation");
        }
        allMessagesFor(currentUser.getId()).stream()
                .filter(message -> message.getReceiver().getId().equals(currentUser.getId()))
                .filter(message -> message.getListing() != null && message.getListing().getId().equals(participants.listingId()))
                .filter(message -> conversationKey.equals(conversationKey(message.getSender().getId(), message.getReceiver().getId(), message.getListing().getId())))
                .forEach(message -> message.setIsRead(true));
    }

    private List<Message> allMessagesFor(UUID userId) {
        List<Message> messages = new ArrayList<>(messageRepository.findBySender_Id(userId));
        messageRepository.findByReceiver_Id(userId).forEach(message -> {
            if (!messages.contains(message)) messages.add(message);
        });
        return messages;
    }

    private ConversationResponse toConversation(String key, List<Message> messages, UUID currentUserId) {
        Message last = messages.stream().max(Comparator.comparing(Message::getCreatedAt)).orElseThrow();
        User other = last.getSender().getId().equals(currentUserId) ? last.getReceiver() : last.getSender();
        Listing listing = last.getListing();
        ListingPhoto photo = listingPhotoRepository.findByListing_IdOrderByDisplayOrderAsc(listing.getId()).stream().findFirst().orElse(null);
        long unread = messages.stream().filter(message -> message.getReceiver().getId().equals(currentUserId) && !Boolean.TRUE.equals(message.getIsRead())).count();
        return ConversationResponse.builder()
                .conversationKey(key)
                .otherUserId(other.getId())
                .otherUserName(other.getFullName())
                .otherUserAvatarUrl(other.getAvatarUrl())
                .listingId(listing.getId())
                .listingTitle(listing.getTitle())
                .listingPhotoUrl(photo == null ? null : photo.getUrl())
                .lastMessage(toResponse(last))
                .unreadCount(unread)
                .build();
    }

    private MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFullName())
                .senderAvatarUrl(message.getSender().getAvatarUrl())
                .receiverId(message.getReceiver().getId())
                .content(message.getContent())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }

    public static String conversationKey(UUID first, UUID second, UUID listingId) {
        UUID low = first.toString().compareTo(second.toString()) < 0 ? first : second;
        UUID high = low.equals(first) ? second : first;
        return low + KEY_SEPARATOR + high + KEY_SEPARATOR + listingId;
    }

    private ConversationParticipants parseKey(String key) {
        String[] parts = key.split(KEY_SEPARATOR, -1);
        if (parts.length != 3) throw new IllegalArgumentException("Invalid conversation key");
        try {
            return new ConversationParticipants(UUID.fromString(parts[0]), UUID.fromString(parts[1]), UUID.fromString(parts[2]));
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException("Invalid conversation key", exception);
        }
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private record ConversationParticipants(UUID firstUserId, UUID secondUserId, UUID listingId) { }
}
