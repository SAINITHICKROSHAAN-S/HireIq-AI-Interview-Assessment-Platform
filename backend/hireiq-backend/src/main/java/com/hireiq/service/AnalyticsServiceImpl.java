package com.hireiq.service;

import com.hireiq.dto.AssessmentAnalyticsResponse;
import com.hireiq.dto.QuestionAccuracySummary;
import com.hireiq.dto.QuestionAnalyticsResponse;
import com.hireiq.dto.RecruiterDashboardResponse;
import com.hireiq.entity.*;
import com.hireiq.repository.AssessmentRepository;
import com.hireiq.repository.CandidateAnswerRepository;
import com.hireiq.repository.CandidateAssessmentRepository;
import com.hireiq.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;
    private final CandidateAssessmentRepository candidateAssessmentRepository;
    private final CandidateAnswerRepository candidateAnswerRepository;

    @Override
    @Transactional(readOnly = true)
    public AssessmentAnalyticsResponse getAssessmentAnalytics(Long assessmentId, User recruiter) {
        // Enforce role authorization: Only Recruiter and Admin roles can access analytics
        checkRoleAuthorization(recruiter);

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with id: " + assessmentId));

        // Enforce ownership check: Recruiter can only access their own assessments
        if (recruiter.getRole() == Role.RECRUITER && !assessment.getCreatedBy().getId().equals(recruiter.getId())) {
            throw new SecurityException("You are not authorized to view analytics for this assessment");
        }

        Long totalAttempts = candidateAssessmentRepository.countByAssessmentId(assessmentId);
        Long completedAttempts = candidateAssessmentRepository.countByAssessmentIdAndStatus(assessmentId, CandidateAssessmentStatus.SUBMITTED);

        double completionPercentage = totalAttempts > 0 
                ? (completedAttempts.doubleValue() / totalAttempts) * 100.0 
                : 0.0;

        List<Object[]> statsList = candidateAssessmentRepository.getAssessmentScoreStats(assessmentId);
        Double averageScore = 0.0;
        Integer highestScore = 0;
        Integer lowestScore = 0;

        if (statsList != null && !statsList.isEmpty() && statsList.get(0)[0] != null) {
            Object[] stats = statsList.get(0);
            averageScore = (Double) stats[0];
            highestScore = ((Number) stats[1]).intValue();
            lowestScore = ((Number) stats[2]).intValue();
        }

        // Calculate pass percentage: threshold is 50% of max possible points
        int totalPoints = questionRepository.findByAssessmentId(assessmentId).stream()
                .mapToInt(Question::getPoints)
                .sum();
        int passThreshold = (int) Math.ceil(totalPoints * 0.5);

        Long passedAttempts = candidateAssessmentRepository
                .countByAssessmentIdAndStatusAndScoreGreaterThanEqual(assessmentId, CandidateAssessmentStatus.SUBMITTED, passThreshold);

        double passPercentage = completedAttempts > 0 
                ? (passedAttempts.doubleValue() / completedAttempts) * 100.0 
                : 0.0;

        return AssessmentAnalyticsResponse.builder()
                .assessmentId(assessmentId)
                .assessmentTitle(assessment.getTitle())
                .totalAttempts(totalAttempts)
                .averageScore(averageScore)
                .highestScore(highestScore)
                .lowestScore(lowestScore)
                .passPercentage(passPercentage)
                .completionPercentage(completionPercentage)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionAnalyticsResponse getQuestionAnalytics(Long questionId, User recruiter) {
        checkRoleAuthorization(recruiter);

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + questionId));

        if (recruiter.getRole() == Role.RECRUITER && !question.getAssessment().getCreatedBy().getId().equals(recruiter.getId())) {
            throw new SecurityException("You are not authorized to view analytics for this question");
        }

        Long totalAttempts = candidateAnswerRepository.countByQuestionId(questionId);
        Long correctAttempts = candidateAnswerRepository.countCorrectAnswersByQuestionId(questionId);

        double accuracyPercentage = totalAttempts > 0 
                ? (correctAttempts.doubleValue() / totalAttempts) * 100.0 
                : 0.0;

        return QuestionAnalyticsResponse.builder()
                .questionId(questionId)
                .questionText(question.getText())
                .totalAttempts(totalAttempts)
                .correctAttempts(correctAttempts)
                .accuracyPercentage(accuracyPercentage)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public RecruiterDashboardResponse getRecruiterDashboardAnalytics(User recruiter) {
        checkRoleAuthorization(recruiter);

        Long userId = recruiter.getId();
        boolean isAdmin = recruiter.getRole() == Role.ADMIN;

        Long totalAssessments = isAdmin 
                ? assessmentRepository.count() 
                : assessmentRepository.countByCreatedById(userId);

        Long totalQuestions = isAdmin 
                ? questionRepository.count() 
                : questionRepository.countQuestionsByRecruiterId(userId);

        Long totalAttempts = isAdmin 
                ? candidateAssessmentRepository.count() 
                : candidateAssessmentRepository.countAttemptsByRecruiterId(userId);

        Double averageScoreVal = isAdmin 
                ? candidateAssessmentRepository.getGlobalAverageScore() 
                : candidateAssessmentRepository.getAverageScoreByRecruiterId(userId);
        double averageScore = averageScoreVal != null ? averageScoreVal : 0.0;

        // Fetch question accuracy stats for most correct/incorrect questions
        List<Object[]> accuracyStats = isAdmin 
                ? candidateAnswerRepository.getGlobalQuestionAccuracyStats() 
                : candidateAnswerRepository.getQuestionAccuracyStatsByRecruiter(userId);

        List<QuestionAccuracySummary> summaries = accuracyStats.stream()
                .map(row -> {
                    Long questionId = (Long) row[0];
                    String questionText = (String) row[1];
                    Long total = (Long) row[2];
                    Double correct = (Double) row[3];
                    double accuracy = total > 0 ? (correct / total) * 100.0 : 0.0;

                    return QuestionAccuracySummary.builder()
                            .questionId(questionId)
                            .questionText(questionText)
                            .accuracyPercentage(accuracy)
                            .build();
                })
                .collect(Collectors.toList());

        List<QuestionAccuracySummary> mostCorrect = summaries.stream()
                .sorted(Comparator.comparing(QuestionAccuracySummary::getAccuracyPercentage).reversed())
                .limit(5)
                .collect(Collectors.toList());

        List<QuestionAccuracySummary> mostIncorrect = summaries.stream()
                .sorted(Comparator.comparing(QuestionAccuracySummary::getAccuracyPercentage))
                .limit(5)
                .collect(Collectors.toList());

        return RecruiterDashboardResponse.builder()
                .totalAssessmentsCreated(totalAssessments)
                .totalQuestionsCreated(totalQuestions)
                .totalCandidateAttempts(totalAttempts)
                .averageAssessmentScore(averageScore)
                .mostCorrectQuestions(mostCorrect)
                .mostIncorrectQuestions(mostIncorrect)
                .build();
    }

    private void checkRoleAuthorization(User user) {
        boolean isRecruiter = user.getRole() == Role.RECRUITER;
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isRecruiter && !isAdmin) {
            throw new SecurityException("Only recruiters and administrators are authorized to access analytics dashboards");
        }
    }
}
