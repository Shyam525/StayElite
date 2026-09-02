package com.stayelite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistItemResponse {
    private UUID listingId;
    private String title;
    private String city;
    private String country;
    private String primaryPhotoUrl;
    private BigDecimal pricePerNight;
    private Double averageRating;
    private Integer reviewCount;
    private String propertyType;
    private LocalDateTime savedAt;
}
