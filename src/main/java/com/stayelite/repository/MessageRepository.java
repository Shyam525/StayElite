package com.stayelite.repository;

import com.stayelite.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderId(UUID senderId);
    List<Message> findByReceiverId(UUID receiverId);
    List<Message> findByListingId(UUID listingId);
}
