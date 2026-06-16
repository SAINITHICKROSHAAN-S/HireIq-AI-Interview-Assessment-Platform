package com.hireiq.dto;

import com.hireiq.entity.AssessmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AssessmentResponse {

    private Long id;
    private String title;
    private String description;
    private Integer duration;
    private AssessmentStatus status;
    private String createdByEmail;
    private LocalDateTime createdAt;
}
