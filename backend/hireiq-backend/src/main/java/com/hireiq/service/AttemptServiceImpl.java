package com.hireiq.service;

import com.hireiq.dto.AttemptResponse;
import com.hireiq.dto.AttemptResultResponse;
import com.hireiq.dto.CandidateAnswerResponse;
import com.hireiq.dto.SubmitAnswerRequest;
import com.hireiq.entity.*;
import com.hireiq.repository.AssessmentRepository;
import com.hireiq.repository.CandidateAnswerRepository;
import com.hireiq.repository.CandidateAssessmentRepository;
import com.hireiq.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttemptServiceImpl implements AttemptService {

    private final CandidateAssessmentRepository candidateAssessmentRepository;
    private final CandidateAnswerRepository candidateAnswerRepository;
    private final AssessmentRepository assessmentRepository;
    private final QuestionRepository questionRepository;

    @Override
    @Transactional
    public AttemptResponse startAttempt(Long assessmentId, User candidate) {
        // Enforce role authorization: Only candidates can start attempts
        if (candidate.getRole() != Role.CANDIDATE) {
            throw new SecurityException("Only candidates are allowed to attempt assessments");
        }

        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with id: " + assessmentId));

        // Enforce status constraint: The assessment must be published
        if (assessment.getStatus() != AssessmentStatus.PUBLISHED) {
            throw new IllegalArgumentException("Cannot start attempt. Assessment is not published.");
        }

        CandidateAssessment attempt = CandidateAssessment.builder()
                .candidate(candidate)
                .assessment(assessment)
                .status(CandidateAssessmentStatus.IN_PROGRESS)
                .startTime(LocalDateTime.now())
                .answers(new ArrayList<>())
                .build();

        CandidateAssessment saved = candidateAssessmentRepository.save(attempt);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void submitAnswer(Long attemptId, SubmitAnswerRequest request, User candidate) {
        CandidateAssessment attempt = candidateAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found with id: " + attemptId));

        // Authorization and state checks
        checkAttemptAccess(attempt, candidate);
        if (attempt.getStatus() != CandidateAssessmentStatus.IN_PROGRESS) {
            throw new IllegalStateException("Cannot submit answers to a completed assessment");
        }

        Question question = questionRepository.findById(request.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + request.getQuestionId()));

        // Ensure the question belongs to this assessment
        if (!question.getAssessment().getId().equals(attempt.getAssessment().getId())) {
            throw new IllegalArgumentException("Question does not belong to the attempted assessment");
        }

        // Find the selected option
        QuestionOption selectedOption = question.getOptions().stream()
                .filter(opt -> opt.getId().equals(request.getSelectedOptionId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid option selected for this question"));

        // If an answer for this question already exists, update it, else insert a new one
        Optional<CandidateAnswer> existingAnswerOpt = candidateAnswerRepository
                .findByCandidateAssessmentIdAndQuestionId(attemptId, request.getQuestionId());

        if (existingAnswerOpt.isPresent()) {
            CandidateAnswer existing = existingAnswerOpt.get();
            existing.setSelectedOption(selectedOption);
            candidateAnswerRepository.save(existing);
        } else {
            CandidateAnswer answer = CandidateAnswer.builder()
                    .candidateAssessment(attempt)
                    .question(question)
                    .selectedOption(selectedOption)
                    .build();
            candidateAnswerRepository.save(answer);
        }
    }

    @Override
    @Transactional
    public AttemptResponse submitAttempt(Long attemptId, User candidate) {
        CandidateAssessment attempt = candidateAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found with id: " + attemptId));

        // Authorization and state checks
        checkAttemptAccess(attempt, candidate);
        if (attempt.getStatus() != CandidateAssessmentStatus.IN_PROGRESS) {
            throw new IllegalStateException("Assessment has already been submitted");
        }

        // Auto-calculate score
        List<Question> questions = questionRepository.findByAssessmentId(attempt.getAssessment().getId());
        
        // Map of submitted answers for this attempt: QuestionId -> SelectedOptionId
        Map<Long, Long> answeredMap = attempt.getAnswers().stream()
                .collect(Collectors.toMap(
                        ans -> ans.getQuestion().getId(),
                        ans -> ans.getSelectedOption().getId()
                ));

        int totalScore = 0;
        for (Question q : questions) {
            // Find the correct option
            Long correctOptionId = q.getOptions().stream()
                    .filter(QuestionOption::getIsCorrect)
                    .map(QuestionOption::getId)
                    .findFirst()
                    .orElse(null);

            Long selectedOptionId = answeredMap.get(q.getId());
            if (correctOptionId != null && correctOptionId.equals(selectedOptionId)) {
                totalScore += q.getPoints();
            }
        }

        attempt.setScore(totalScore);
        attempt.setStatus(CandidateAssessmentStatus.SUBMITTED);
        attempt.setEndTime(LocalDateTime.now());

        CandidateAssessment saved = candidateAssessmentRepository.save(attempt);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AttemptResultResponse getAttemptResult(Long attemptId, User candidate) {
        CandidateAssessment attempt = candidateAssessmentRepository.findById(attemptId)
                .orElseThrow(() -> new IllegalArgumentException("Attempt not found with id: " + attemptId));

        // Authorization check
        checkAttemptAccess(attempt, candidate);

        if (attempt.getStatus() != CandidateAssessmentStatus.SUBMITTED) {
            throw new IllegalStateException("Attempt results are only available after submission");
        }

        List<Question> questions = questionRepository.findByAssessmentId(attempt.getAssessment().getId());
        
        // Map: QuestionId -> CandidateAnswer
        Map<Long, CandidateAnswer> answerMap = attempt.getAnswers().stream()
                .collect(Collectors.toMap(ans -> ans.getQuestion().getId(), ans -> ans));

        int maxPossibleScore = questions.stream().mapToInt(Question::getPoints).sum();

        List<CandidateAnswerResponse> answerResponses = questions.stream()
                .map(q -> {
                    CandidateAnswer answer = answerMap.get(q.getId());
                    QuestionOption correctOption = q.getOptions().stream()
                            .filter(QuestionOption::getIsCorrect)
                            .findFirst()
                            .orElse(null);

                    Long selectedOptionId = answer != null ? answer.getSelectedOption().getId() : null;
                    String selectedOptionText = answer != null ? answer.getSelectedOption().getText() : "No Answer";
                    Long correctOptionId = correctOption != null ? correctOption.getId() : null;
                    String correctOptionText = correctOption != null ? correctOption.getText() : "N/A";

                    boolean isCorrect = correctOptionId != null && correctOptionId.equals(selectedOptionId);
                    int pointsEarned = isCorrect ? q.getPoints() : 0;

                    return CandidateAnswerResponse.builder()
                            .questionId(q.getId())
                            .questionText(q.getText())
                            .selectedOptionId(selectedOptionId)
                            .selectedOptionText(selectedOptionText)
                            .correctOptionId(correctOptionId)
                            .correctOptionText(correctOptionText)
                            .isCorrect(isCorrect)
                            .pointsEarned(pointsEarned)
                            .build();
                })
                .collect(Collectors.toList());

        return AttemptResultResponse.builder()
                .id(attempt.getId())
                .assessmentId(attempt.getAssessment().getId())
                .assessmentTitle(attempt.getAssessment().getTitle())
                .status(attempt.getStatus())
                .totalScore(attempt.getScore())
                .maxPossibleScore(maxPossibleScore)
                .startTime(attempt.getStartTime())
                .endTime(attempt.getEndTime())
                .answers(answerResponses)
                .build();
    }

    private void checkAttemptAccess(CandidateAssessment attempt, User currentUser) {
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isAttemptOwner = attempt.getCandidate().getId().equals(currentUser.getId());

        if (!isAdmin && !isAttemptOwner) {
            throw new SecurityException("You are not authorized to access this assessment attempt");
        }
    }

    private AttemptResponse mapToResponse(CandidateAssessment attempt) {
        return AttemptResponse.builder()
                .id(attempt.getId())
                .assessmentId(attempt.getAssessment().getId())
                .assessmentTitle(attempt.getAssessment().getTitle())
                .candidateEmail(attempt.getCandidate().getEmail())
                .status(attempt.getStatus())
                .score(attempt.getScore())
                .startTime(attempt.getStartTime())
                .endTime(attempt.getEndTime())
                .build();
    }
}
