package com.stayelite.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailabilityRequest {
    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Availability flag is required")
    private Boolean isAvailable;

    private BigDecimal priceOverride;
}
