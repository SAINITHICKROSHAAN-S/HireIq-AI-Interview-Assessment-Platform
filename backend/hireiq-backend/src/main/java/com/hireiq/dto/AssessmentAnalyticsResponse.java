package com.hireiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentAnalyticsResponse {
    
    private Long assessmentId;
    private String assessmentTitle;
    private Long totalAttempts;
    private Double averageScore;
    private Integer highestScore;
    private Integer lowestScore;
    private Double passPercentage;
    private Double completionPercentage;
}
