package com.hireiq.service;

import com.hireiq.dto.AssessmentRequest;
import com.hireiq.dto.AssessmentResponse;
import com.hireiq.entity.User;
import java.util.List;

public interface AssessmentService {
    
    AssessmentResponse createAssessment(AssessmentRequest request, User currentUser);
    
    List<AssessmentResponse> getAllAssessments();
    
    AssessmentResponse getAssessmentById(Long id);
    
    AssessmentResponse updateAssessment(Long id, AssessmentRequest request, User currentUser);
    
    void deleteAssessment(Long id, User currentUser);
}
