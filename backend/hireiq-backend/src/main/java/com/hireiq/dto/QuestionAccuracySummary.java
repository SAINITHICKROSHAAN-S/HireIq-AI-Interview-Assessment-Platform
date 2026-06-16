package com.hireiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionAccuracySummary {

    private Long questionId;
    private String questionText;
    private Double accuracyPercentage;
}
