package com.hireiq.dto;

import com.hireiq.entity.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponse {

    private Long id;
    private String text;
    private QuestionType type;
    private Integer points;
    private Long assessmentId;
    private List<QuestionOptionResponse> options;
}
