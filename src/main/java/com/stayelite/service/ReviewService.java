package com.stayelite.service;

import com.stayelite.dto.CreateReviewRequest;
import com.stayelite.dto.RatingSummary;
import com.stayelite.dto.ReviewResponse;
import com.stayelite.entity.Booking;
import com.stayelite.entity.BookingStatus;
import com.stayelite.entity.Review;
import com.stayelite.entity.User;
import com.stayelite.repository.BookingRepository;
import com.stayelite.repository.ReviewRepository;
import com.stayelite.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse submitReview(CreateReviewRequest request, String email) {
        User reviewer = findUser(email);
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getGuest().getId().equals(reviewer.getId())) {
            throw new AccessDeniedException("You can only review your own bookings");
        }
        if (booking.getStatus() != BookingStatus.COMPLETED || !booking.getCheckOut().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("A review can only be submitted after check-out for a completed booking");
        }
        if (reviewRepository.findByBooking_Id(booking.getId()).isPresent()) {
            throw new IllegalArgumentException("A review has already been submitted for this booking");
        }

        Review review = Review.builder()
                .booking(booking)
                .reviewer(reviewer)
                .listing(booking.getListing())
                .overallRating(request.getOverallRating())
                .cleanlinessRating(request.getCleanlinessRating())
                .locationRating(request.getLocationRating())
                .valueRating(request.getValueRating())
                .comment(request.getComment().trim())
                .build();
        ReviewResponse response = toResponse(reviewRepository.save(review));
        refreshListingAverage(booking.getListing().getId());
        return response;
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getListingReviews(UUID listingId, Pageable pageable) {
        return reviewRepository.findByListing_Id(listingId, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public RatingSummary getRatingSummary(UUID listingId) {
        List<Review> reviews = reviewRepository.findByListing_Id(listingId);
        long total = reviews.size();
        return RatingSummary.builder()
                .overallAverage(average(reviews.stream().map(Review::getOverallRating).collect(Collectors.toList())))
                .cleanlinessAverage(average(reviews.stream().map(Review::getCleanlinessRating).collect(Collectors.toList())))
                .locationAverage(average(reviews.stream().map(Review::getLocationRating).collect(Collectors.toList())))
                .valueAverage(average(reviews.stream().map(Review::getValueRating).collect(Collectors.toList())))
                .totalReviews(total)
                .distribution(distribution(reviews))
                .build();
    }

    private void refreshListingAverage(UUID listingId) {
        List<Review> reviews = reviewRepository.findByListing_Id(listingId);
        BigDecimal average = average(reviews.stream().map(Review::getOverallRating).collect(Collectors.toList()));
        if (!reviews.isEmpty()) {
            reviews.get(0).getListing().setAverageRating(average);
        }
    }

    private BigDecimal average(List<Integer> ratings) {
        if (ratings.isEmpty()) return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        return BigDecimal.valueOf(ratings.stream().mapToInt(Integer::intValue).average().orElse(0))
                .setScale(2, RoundingMode.HALF_UP);
    }

    private Map<Integer, BigDecimal> distribution(List<Review> reviews) {
        Map<Integer, BigDecimal> result = new LinkedHashMap<>();
        for (int star = 5; star >= 1; star--) {
            final int rating = star;
            long count = reviews.stream().filter(review -> review.getOverallRating() == rating).count();
            BigDecimal percentage = reviews.isEmpty() ? BigDecimal.ZERO : BigDecimal.valueOf(count * 100.0 / reviews.size()).setScale(2, RoundingMode.HALF_UP);
            result.put(star, percentage);
        }
        return result;
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .reviewerName(review.getReviewer().getFullName())
                .reviewerAvatarUrl(review.getReviewer().getAvatarUrl())
                .date(review.getCreatedAt())
                .overallRating(review.getOverallRating())
                .cleanlinessRating(review.getCleanlinessRating())
                .locationRating(review.getLocationRating())
                .valueRating(review.getValueRating())
                .comment(review.getComment())
                .build();
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
