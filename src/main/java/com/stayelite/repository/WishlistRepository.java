package com.stayelite.repository;

import com.stayelite.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(UUID userId);
    List<Wishlist> findByListingId(UUID listingId);
}
