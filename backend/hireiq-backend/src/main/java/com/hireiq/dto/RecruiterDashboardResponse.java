package com.hireiq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecruiterDashboardResponse {

    private Long totalAssessmentsCreated;
    private Long totalQuestionsCreated;
    private Long totalCandidateAttempts;
    private Double averageAssessmentScore;
    private List<QuestionAccuracySummary> mostCorrectQuestions;
    private List<QuestionAccuracySummary> mostIncorrectQuestions;
}
