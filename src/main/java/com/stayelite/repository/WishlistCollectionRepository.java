package com.stayelite.repository;

import com.stayelite.entity.WishlistCollection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistCollectionRepository extends JpaRepository<WishlistCollection, UUID> {

    List<WishlistCollection> findByUserIdOrderByCreatedAtDesc(UUID userId);

    Optional<WishlistCollection> findByIdAndUserId(UUID id, UUID userId);
}
