package com.stayelite.dto;

import com.stayelite.entity.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListingResponse {
    private UUID id;
    private UUID hostId;
    private String hostName;
    private String title;
    private String description;
    private PropertyType propertyType;
    private String address;
    private String city;
    private String state;
    private String country;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal basePricePerNight;
    private BigDecimal cleaningFee;
    private Integer maxGuests;
    private Integer bedrooms;
    private Integer bathrooms;
    private Boolean isActive;
    private Double averageRating;
    private List<String> photoUrls;
    private List<Long> amenityIds;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
