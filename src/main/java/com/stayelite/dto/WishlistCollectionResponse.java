package com.stayelite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistCollectionResponse {
    private UUID id;
    private String name;
    private int listingCount;
    private List<String> previewPhotoUrls;
    private LocalDateTime createdAt;
}
