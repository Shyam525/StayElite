package com.stayelite.controller;

import com.stayelite.common.ApiResponse;
import com.stayelite.dto.WishlistCollectionRequest;
import com.stayelite.dto.WishlistCollectionResponse;
import com.stayelite.dto.WishlistItemResponse;
import com.stayelite.dto.WishlistToggleResponse;
import com.stayelite.entity.User;
import com.stayelite.repository.UserRepository;
import com.stayelite.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlists")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserRepository userRepository;

    private UUID getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @PostMapping("/toggle/{listingId}")
    public ResponseEntity<ApiResponse<WishlistToggleResponse>> toggleWishlist(
            @PathVariable UUID listingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        WishlistToggleResponse response = wishlistService.toggleWishlist(userId, listingId);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistItemResponse>>> getUserWishlist(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        List<WishlistItemResponse> response = wishlistService.getUserWishlist(userId);
        return ResponseEntity.ok(ApiResponse.success("User wishlist fetched successfully", response));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<UUID, Boolean>>> getWishlistStatus(
            @RequestParam List<UUID> listingIds,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        Map<UUID, Boolean> status = wishlistService.getWishlistStatus(userId, listingIds);
        return ResponseEntity.ok(ApiResponse.success("Wishlist status fetched successfully", status));
    }

    @PostMapping("/collections")
    public ResponseEntity<ApiResponse<WishlistCollectionResponse>> createCollection(
            @Valid @RequestBody WishlistCollectionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        WishlistCollectionResponse response = wishlistService.createCollection(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Wishlist collection created successfully", response));
    }

    @GetMapping("/collections")
    public ResponseEntity<ApiResponse<List<WishlistCollectionResponse>>> getUserCollections(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        List<WishlistCollectionResponse> response = wishlistService.getUserCollections(userId);
        return ResponseEntity.ok(ApiResponse.success("Wishlist collections fetched successfully", response));
    }

    @DeleteMapping("/collections/{collectionId}")
    public ResponseEntity<ApiResponse<Void>> deleteCollection(
            @PathVariable UUID collectionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        wishlistService.deleteCollection(userId, collectionId);
        return ResponseEntity.ok(ApiResponse.success("Collection deleted successfully", null));
    }

    @PostMapping("/collections/{collectionId}/listings/{listingId}")
    public ResponseEntity<ApiResponse<Void>> addToCollection(
            @PathVariable UUID collectionId,
            @PathVariable UUID listingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        wishlistService.addToCollection(userId, collectionId, listingId);
        return ResponseEntity.ok(ApiResponse.success("Listing added to collection", null));
    }

    @DeleteMapping("/collections/{collectionId}/listings/{listingId}")
    public ResponseEntity<ApiResponse<Void>> removeFromCollection(
            @PathVariable UUID collectionId,
            @PathVariable UUID listingId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = getUserId(userDetails);
        wishlistService.removeFromCollection(userId, collectionId, listingId);
        return ResponseEntity.ok(ApiResponse.success("Listing removed from collection", null));
    }
}
