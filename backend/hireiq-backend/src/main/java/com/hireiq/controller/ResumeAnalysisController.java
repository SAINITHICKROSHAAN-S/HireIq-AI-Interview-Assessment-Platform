package com.hireiq.controller;

import com.hireiq.dto.ResumeAnalysisRequest;
import com.hireiq.dto.ResumeAnalysisResponse;
import com.hireiq.entity.Role;
import com.hireiq.entity.User;
import com.hireiq.service.AIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeAnalysisController {

    private final AIService aiService;

    @PostMapping("/analyze")
    public ResponseEntity<ResumeAnalysisResponse> analyzeResume(
            @Valid @RequestBody ResumeAnalysisRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        // Enforce authorization: Only Candidate role can analyze resumes
        if (currentUser.getRole() != Role.CANDIDATE) {
            throw new SecurityException("Only candidates are authorized to run resume analysis");
        }

        return ResponseEntity.ok(aiService.analyzeResume(request.getResumeText()));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<String> handleSecurityException(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}
