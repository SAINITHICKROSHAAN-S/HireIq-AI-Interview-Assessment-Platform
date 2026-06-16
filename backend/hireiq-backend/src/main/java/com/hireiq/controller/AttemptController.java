package com.hireiq.controller;

import com.hireiq.dto.AttemptResponse;
import com.hireiq.dto.AttemptResultResponse;
import com.hireiq.dto.SubmitAnswerRequest;
import com.hireiq.entity.User;
import com.hireiq.service.AttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class AttemptController {

    private final AttemptService attemptService;

    @PostMapping("/start/{assessmentId}")
    public ResponseEntity<AttemptResponse> startAttempt(
            @PathVariable Long assessmentId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attemptService.startAttempt(assessmentId, currentUser));
    }

    @PostMapping("/{attemptId}/answers")
    public ResponseEntity<Void> submitAnswer(
            @PathVariable Long attemptId,
            @Valid @RequestBody SubmitAnswerRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        attemptService.submitAnswer(attemptId, request, currentUser);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{attemptId}/submit")
    public ResponseEntity<AttemptResponse> submitAttempt(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(attemptService.submitAttempt(attemptId, currentUser));
    }

    @GetMapping("/{attemptId}/results")
    public ResponseEntity<AttemptResultResponse> getAttemptResult(
            @PathVariable Long attemptId,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(attemptService.getAttemptResult(attemptId, currentUser));
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<String> handleSecurityException(SecurityException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
}
