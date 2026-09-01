package com.stayelite.dto;

import com.stayelite.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private UUID id;
    private UUID listingId;
    private String listingTitle;
    private UUID guestId;
    private String guestName;
    private UUID hostId;
    private String hostName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guestsCount;
    private BigDecimal baseAmount;
    private BigDecimal serviceFee;
    private BigDecimal cleaningFee;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private String stripePaymentIntentId;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
