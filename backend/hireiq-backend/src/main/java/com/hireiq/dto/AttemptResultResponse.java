package com.hireiq.dto;

import com.hireiq.entity.CandidateAssessmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttemptResultResponse {

    private Long id;
    private Long assessmentId;
    private String assessmentTitle;
    private CandidateAssessmentStatus status;
    private Integer totalScore;
    private Integer maxPossibleScore;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<CandidateAnswerResponse> answers;
}
