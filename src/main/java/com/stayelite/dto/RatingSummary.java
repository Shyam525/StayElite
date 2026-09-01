package com.stayelite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingSummary {
    private BigDecimal overallAverage;
    private BigDecimal cleanlinessAverage;
    private BigDecimal locationAverage;
    private BigDecimal valueAverage;
    private long totalReviews;
    private Map<Integer, BigDecimal> distribution;
}
