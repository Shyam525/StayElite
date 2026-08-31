package com.stayelite.repository;

import com.stayelite.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByListingId(UUID listingId);
    List<Review> findByReviewerId(UUID reviewerId);
}
