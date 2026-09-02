package com.stayelite.repository;

import com.stayelite.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {

    boolean existsByUserIdAndListingId(UUID userId, UUID listingId);

    Optional<Wishlist> findByUserIdAndListingId(UUID userId, UUID listingId);

    List<Wishlist> findByUserIdOrderByCreatedAtDesc(UUID userId);

    void deleteByUserIdAndListingId(UUID userId, UUID listingId);

    @Query("SELECT w.listing.id FROM Wishlist w WHERE w.user.id = :userId AND w.listing.id IN :listingIds")
    List<UUID> findSavedListingIdsByUserIdAndListingIdIn(@Param("userId") UUID userId, @Param("listingIds") List<UUID> listingIds);
}
