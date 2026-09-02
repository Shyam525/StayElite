package com.stayelite.controller;

import com.stayelite.common.ApiResponse;
import com.stayelite.dto.*;
import com.stayelite.entity.Availability;
import com.stayelite.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
@Validated
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<ListingResponse>> createListing(
            @Valid @RequestBody CreateListingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ListingResponse response = listingService.createListing(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Listing created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<ListingResponse>> updateListing(
            @PathVariable UUID id,
            @Valid @RequestBody CreateListingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ListingResponse response = listingService.updateListing(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Listing updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<Void>> deleteListing(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        listingService.deleteListing(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Listing deleted successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ListingResponse>> getListingById(@PathVariable UUID id) {
        ListingResponse response = listingService.getListingById(id);
        return ResponseEntity.ok(ApiResponse.success("Listing fetched successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ListingSearchResponse>> searchListings(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String propertyType,
            @RequestParam(required = false) List<String> propertyTypes,
            @RequestParam(required = false) List<Long> amenities,
            @RequestParam(required = false) BigDecimal swLat,
            @RequestParam(required = false) BigDecimal swLng,
            @RequestParam(required = false) BigDecimal neLat,
            @RequestParam(required = false) BigDecimal neLng,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ListingSearchResponse response = listingService.searchListings(
                city,
                checkIn,
                checkOut,
                guests,
                minPrice,
                maxPrice,
                propertyType,
                propertyTypes,
                amenities,
                swLat,
                swLng,
                neLat,
                neLng,
                page,
                size
        );

        return ResponseEntity.ok(ApiResponse.success("Listings fetched successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<List<ListingResponse>>> getMyListings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ListingResponse> response = listingService.getMyListings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Your listings fetched successfully", response));
    }

    @PostMapping(value = "/{id}/photos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<List<String>>> uploadPhotos(
            @PathVariable UUID id,
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<String> response = listingService.uploadPhotos(id, files, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Photos uploaded successfully", response));
    }

    @PutMapping("/{id}/availability")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<List<Availability>>> setAvailability(
            @PathVariable UUID id,
            @Valid @RequestBody List<AvailabilityRequest> requests,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<Availability> response = listingService.setAvailability(id, requests, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Availability updated successfully", response));
    }
}
