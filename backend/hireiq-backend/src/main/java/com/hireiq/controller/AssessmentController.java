package com.hireiq.controller;

import com.hireiq.dto.AssessmentRequest;
import com.hireiq.dto.AssessmentResponse;
import com.hireiq.entity.User;
import com.hireiq.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<AssessmentResponse> createAssessment(
            @Valid @RequestBody AssessmentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assessmentService.createAssessment(request, currentUser));
    }

    @GetMapping
    public ResponseEntity<List<AssessmentResponse>> getAllAssessments() {
        return ResponseEntity.ok(assessmentService.getAllAssessments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssessmentResponse> getAssessmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assessmentService.getAssessmentById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssessmentResponse> updateAssessment(
            @PathVariable Long id,
            @Valid @RequestBody AssessmentRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(assessmentService.updateAssessment(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssessment(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        assessmentService.deleteAssessment(id, currentUser);
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
