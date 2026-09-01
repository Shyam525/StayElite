package com.stayelite.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private String reviewerName;
    private String reviewerAvatarUrl;
    private LocalDateTime date;
    private Integer overallRating;
    private Integer cleanlinessRating;
    private Integer locationRating;
    private Integer valueRating;
    private String comment;
}
