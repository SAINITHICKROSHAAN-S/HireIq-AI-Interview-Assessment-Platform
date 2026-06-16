package com.hireiq.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionOptionRequest {

    @NotBlank(message = "Option text is required")
    private String text;

    @NotNull(message = "isCorrect flag is required")
    private Boolean isCorrect;
}
