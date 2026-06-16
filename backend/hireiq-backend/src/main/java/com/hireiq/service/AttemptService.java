package com.hireiq.service;

import com.hireiq.dto.AttemptResponse;
import com.hireiq.dto.AttemptResultResponse;
import com.hireiq.dto.SubmitAnswerRequest;
import com.hireiq.entity.User;

public interface AttemptService {
    
    AttemptResponse startAttempt(Long assessmentId, User candidate);
    
    void submitAnswer(Long attemptId, SubmitAnswerRequest request, User candidate);
    
    AttemptResponse submitAttempt(Long attemptId, User candidate);
    
    AttemptResultResponse getAttemptResult(Long attemptId, User candidate);
}
