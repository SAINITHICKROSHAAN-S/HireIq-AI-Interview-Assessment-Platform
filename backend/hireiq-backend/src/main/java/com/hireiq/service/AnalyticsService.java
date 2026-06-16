package com.hireiq.service;

import com.hireiq.dto.AssessmentAnalyticsResponse;
import com.hireiq.dto.QuestionAnalyticsResponse;
import com.hireiq.dto.RecruiterDashboardResponse;
import com.hireiq.entity.User;

public interface AnalyticsService {
    
    AssessmentAnalyticsResponse getAssessmentAnalytics(Long assessmentId, User recruiter);
    
    QuestionAnalyticsResponse getQuestionAnalytics(Long questionId, User recruiter);
    
    RecruiterDashboardResponse getRecruiterDashboardAnalytics(User recruiter);
}
