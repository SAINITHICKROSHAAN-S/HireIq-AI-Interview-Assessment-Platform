package com.hireiq.service;

import com.hireiq.dto.AssessmentRequest;
import com.hireiq.dto.AssessmentResponse;
import com.hireiq.entity.Assessment;
import com.hireiq.entity.User;
import com.hireiq.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentServiceImpl implements AssessmentService {

    private final AssessmentRepository assessmentRepository;

    @Override
    @Transactional
    public AssessmentResponse createAssessment(AssessmentRequest request, User currentUser) {
        // Enforce that Candidates cannot create assessments
        if (currentUser.getRole().name().equals("CANDIDATE")) {
            throw new SecurityException("Candidates are not authorized to create assessments");
        }

        Assessment assessment = Assessment.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .duration(request.getDuration())
                .status(request.getStatus())
                .createdBy(currentUser)
                .build();

        Assessment saved = assessmentRepository.save(assessment);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAllAssessments() {
        return assessmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentResponse getAssessmentById(Long id) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with id: " + id));
        return mapToResponse(assessment);
    }

    @Override
    @Transactional
    public AssessmentResponse updateAssessment(Long id, AssessmentRequest request, User currentUser) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with id: " + id));

        // Authorization check
        checkAuthorization(assessment, currentUser);

        assessment.setTitle(request.getTitle());
        assessment.setDescription(request.getDescription());
        assessment.setDuration(request.getDuration());
        assessment.setStatus(request.getStatus());

        Assessment updated = assessmentRepository.save(assessment);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteAssessment(Long id, User currentUser) {
        Assessment assessment = assessmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with id: " + id));

        // Authorization check
        checkAuthorization(assessment, currentUser);

        assessmentRepository.delete(assessment);
    }

    private void checkAuthorization(Assessment assessment, User currentUser) {
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN");
        boolean isCreator = assessment.getCreatedBy().getId().equals(currentUser.getId());
        
        if (!isAdmin && !isCreator) {
            throw new SecurityException("You are not authorized to perform this operation on this assessment");
        }
    }

    private AssessmentResponse mapToResponse(Assessment assessment) {
        return AssessmentResponse.builder()
                .id(assessment.getId())
                .title(assessment.getTitle())
                .description(assessment.getDescription())
                .duration(assessment.getDuration())
                .status(assessment.getStatus())
                .createdByEmail(assessment.getCreatedBy().getEmail())
                .createdAt(assessment.getCreatedAt())
                .build();
    }
}
