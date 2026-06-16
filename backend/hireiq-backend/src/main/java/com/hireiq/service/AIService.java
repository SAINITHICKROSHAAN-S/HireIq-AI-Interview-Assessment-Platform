package com.hireiq.service;

import com.hireiq.dto.ResumeAnalysisResponse;

public interface AIService {
    
    ResumeAnalysisResponse analyzeResume(String resumeText);
}
