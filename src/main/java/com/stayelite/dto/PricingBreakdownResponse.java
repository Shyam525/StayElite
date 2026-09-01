package com.stayelite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PricingBreakdownResponse {
    private BigDecimal baseAmount;
    private BigDecimal serviceFee;
    private BigDecimal cleaningFee;
    private BigDecimal total;
    private long nights;
}
