package com.hireiq.controller;

import com.hireiq.dto.QuestionRequest;
import com.hireiq.dto.QuestionResponse;
import com.hireiq.entity.User;
import com.hireiq.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/assessments/{assessmentId}/questions")
    public ResponseEntity<QuestionResponse> addQuestion(
            @PathVariable Long assessmentId,
            @Valid @RequestBody QuestionRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(questionService.addQuestion(assessmentId, request, currentUser));
    }

    @GetMapping("/assessments/{assessmentId}/questions")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByAssessment(@PathVariable Long assessmentId) {
        return ResponseEntity.ok(questionService.getQuestionsByAssessment(assessmentId));
    }

    @GetMapping("/questions/{id}")
    public ResponseEntity<QuestionResponse> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody QuestionRequest request,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request, currentUser));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        questionService.deleteQuestion(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<String> handleSecurityException(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

}
