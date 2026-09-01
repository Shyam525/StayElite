package com.stayelite.repository;

import com.stayelite.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByListing_Id(UUID listingId);
    Page<Review> findByListing_Id(UUID listingId, Pageable pageable);
    List<Review> findByReviewer_Id(UUID reviewerId);
    Optional<Review> findByBooking_Id(UUID bookingId);
}
