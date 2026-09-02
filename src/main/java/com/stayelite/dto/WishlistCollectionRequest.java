package com.stayelite.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistCollectionRequest {

    @NotBlank(message = "Collection name is required")
    @Size(min = 2, max = 100, message = "Collection name must be between 2 and 100 characters")
    private String name;
}
