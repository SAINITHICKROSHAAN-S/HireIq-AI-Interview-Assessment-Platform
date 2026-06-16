package com.hireiq.service;

import com.hireiq.dto.QuestionRequest;
import com.hireiq.dto.QuestionResponse;
import com.hireiq.entity.User;
import java.util.List;

public interface QuestionService {
    
    QuestionResponse addQuestion(Long assessmentId, QuestionRequest request, User currentUser);
    
    List<QuestionResponse> getQuestionsByAssessment(Long assessmentId);
    
    QuestionResponse getQuestionById(Long id);
    
    QuestionResponse updateQuestion(Long id, QuestionRequest request, User currentUser);
    
    void deleteQuestion(Long id, User currentUser);
}
