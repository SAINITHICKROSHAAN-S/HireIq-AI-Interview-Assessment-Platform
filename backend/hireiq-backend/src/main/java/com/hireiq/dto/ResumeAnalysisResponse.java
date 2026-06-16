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
public class ResumeAnalysisResponse {

    private Integer overallScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> suggestions;
}
