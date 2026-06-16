package com.hireiq.controller;

import com.hireiq.dto.AssessmentAnalyticsResponse;
import com.hireiq.dto.QuestionAnalyticsResponse;
import com.hireiq.dto.RecruiterDashboardResponse;
import com.hireiq.entity.User;
import com.hireiq.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/assessment/{assessmentId}")
    public ResponseEntity<AssessmentAnalyticsResponse> getAssessmentAnalytics(
            @PathVariable Long assessmentId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(analyticsService.getAssessmentAnalytics(assessmentId, currentUser));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<QuestionAnalyticsResponse> getQuestionAnalytics(
            @PathVariable Long questionId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(analyticsService.getQuestionAnalytics(questionId, currentUser));
    }

    @GetMapping("/recruiter-dashboard")
    public ResponseEntity<RecruiterDashboardResponse> getRecruiterDashboardAnalytics(
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(analyticsService.getRecruiterDashboardAnalytics(currentUser));
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
