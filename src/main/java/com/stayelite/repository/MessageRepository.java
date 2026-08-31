package com.stayelite.repository;

import com.stayelite.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySender_Id(UUID senderId);
    List<Message> findByReceiver_Id(UUID receiverId);
    List<Message> findByListing_Id(UUID listingId);
}
