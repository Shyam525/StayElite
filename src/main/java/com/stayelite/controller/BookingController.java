package com.stayelite.controller;

import com.stayelite.common.ApiResponse;
import com.stayelite.dto.BookingResponse;
import com.stayelite.dto.CreateBookingRequest;
import com.stayelite.dto.PricingBreakdownResponse;
import com.stayelite.entity.BookingStatus;
import com.stayelite.service.BookingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Validated
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody CreateBookingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully",
                bookingService.createBooking(request, userDetails.getUsername())));
    }

    @GetMapping("/preview")
    public ResponseEntity<ApiResponse<PricingBreakdownResponse>> preview(
            @RequestParam UUID listingId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam @NotNull @Min(1) Integer guests) {
        return ResponseEntity.ok(ApiResponse.success("Pricing calculated successfully",
                bookingService.preview(listingId, checkIn, checkOut, guests)));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('GUEST')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @RequestParam(required = false) BookingStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Bookings fetched successfully",
                bookingService.getMyBookings(userDetails.getUsername(), status)));
    }

    @GetMapping("/host")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookingsForMyListings(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Listing bookings fetched successfully",
                bookingService.getBookingsForMyListings(userDetails.getUsername())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Booking fetched successfully",
                bookingService.getBookingById(id, userDetails.getUsername())));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully",
                bookingService.cancelBooking(id, userDetails.getUsername())));
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('HOST')")
    public ResponseEntity<ApiResponse<BookingResponse>> confirmBooking(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully",
                bookingService.confirmBooking(id, userDetails.getUsername())));
    }
}
