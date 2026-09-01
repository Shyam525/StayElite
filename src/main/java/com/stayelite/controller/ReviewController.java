package com.stayelite.controller;

import com.stayelite.common.ApiResponse;
import com.stayelite.dto.CreateReviewRequest;
import com.stayelite.dto.RatingSummary;
import com.stayelite.dto.ReviewResponse;
import com.stayelite.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @Valid @RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully",
                reviewService.submitReview(request, userDetails.getUsername())));
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<ApiResponse<Page<ReviewResponse>>> getListingReviews(
            @PathVariable UUID listingId,
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success("Reviews fetched successfully",
                reviewService.getListingReviews(listingId, pageable)));
    }

    @GetMapping("/listing/{listingId}/summary")
    public ResponseEntity<ApiResponse<RatingSummary>> getRatingSummary(@PathVariable UUID listingId) {
        return ResponseEntity.ok(ApiResponse.success("Rating summary fetched successfully",
                reviewService.getRatingSummary(listingId)));
    }
}
