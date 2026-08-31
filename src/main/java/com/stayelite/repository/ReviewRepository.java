package com.stayelite.repository;

import com.stayelite.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByListing_Id(UUID listingId);
    List<Review> findByReviewer_Id(UUID reviewerId);
}
