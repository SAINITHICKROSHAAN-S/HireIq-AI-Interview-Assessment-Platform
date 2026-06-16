package com.hireiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionAnalyticsResponse {

    private Long questionId;
    private String questionText;
    private Long totalAttempts;
    private Long correctAttempts;
    private Double accuracyPercentage;
}
