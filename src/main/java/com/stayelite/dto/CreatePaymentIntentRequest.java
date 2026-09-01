package com.stayelite.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentIntentRequest {
    private UUID bookingId;
    private UUID listingId;

    @Future(message = "Check-in date must be in the future")
    private LocalDate checkIn;

    @Future(message = "Check-out date must be in the future")
    private LocalDate checkOut;

    @Min(value = 1, message = "Guests must be at least 1")
    private Integer guests;
}
