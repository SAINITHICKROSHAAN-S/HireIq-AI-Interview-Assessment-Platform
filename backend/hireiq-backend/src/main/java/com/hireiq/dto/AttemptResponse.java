package com.hireiq.dto;

import com.hireiq.entity.CandidateAssessmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttemptResponse {

    private Long id;
    private Long assessmentId;
    private String assessmentTitle;
    private String candidateEmail;
    private CandidateAssessmentStatus status;
    private Integer score;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
