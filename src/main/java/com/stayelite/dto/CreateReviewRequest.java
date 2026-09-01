package com.stayelite.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateReviewRequest {
    @NotNull(message = "Booking is required")
    private UUID bookingId;

    @NotNull(message = "Overall rating is required")
    @Min(value = 1, message = "Overall rating must be between 1 and 5")
    @Max(value = 5, message = "Overall rating must be between 1 and 5")
    private Integer overallRating;

    @NotNull(message = "Cleanliness rating is required")
    @Min(value = 1, message = "Cleanliness rating must be between 1 and 5")
    @Max(value = 5, message = "Cleanliness rating must be between 1 and 5")
    private Integer cleanlinessRating;

    @NotNull(message = "Location rating is required")
    @Min(value = 1, message = "Location rating must be between 1 and 5")
    @Max(value = 5, message = "Location rating must be between 1 and 5")
    private Integer locationRating;

    @NotNull(message = "Value rating is required")
    @Min(value = 1, message = "Value rating must be between 1 and 5")
    @Max(value = 5, message = "Value rating must be between 1 and 5")
    private Integer valueRating;

    @NotBlank(message = "Comment is required")
    @Size(min = 20, max = 1000, message = "Comment must be between 20 and 1000 characters")
    private String comment;
}
