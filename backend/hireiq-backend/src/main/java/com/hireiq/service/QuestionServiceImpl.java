package com.hireiq.service;

import com.hireiq.dto.QuestionOptionResponse;
import com.hireiq.dto.QuestionRequest;
import com.hireiq.dto.QuestionResponse;
import com.hireiq.entity.Assessment;
import com.hireiq.entity.Question;
import com.hireiq.entity.QuestionOption;
import com.hireiq.entity.Role;
import com.hireiq.entity.User;
import com.hireiq.repository.AssessmentRepository;
import com.hireiq.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    private final QuestionRepository questionRepository;
    private final AssessmentRepository assessmentRepository;

    @Override
    @Transactional
    public QuestionResponse addQuestion(Long assessmentId, QuestionRequest request, User currentUser) {
        Assessment assessment = assessmentRepository.findById(assessmentId)
                .orElseThrow(() -> new IllegalArgumentException("Assessment not found with id: " + assessmentId));

        // Authorization check: Only assessment creator or admin can add questions
        checkAuthorization(assessment, currentUser);

        Question question = Question.builder()
                .text(request.getText())
                .type(request.getType())
                .points(request.getPoints())
                .assessment(assessment)
                .options(new ArrayList<>())
                .build();

        List<QuestionOption> options = request.getOptions().stream()
                .map(optReq -> QuestionOption.builder()
                        .text(optReq.getText())
                        .isCorrect(optReq.getIsCorrect())
                        .question(question)
                        .build())
                .collect(Collectors.toList());

        question.getOptions().addAll(options);

        Question saved = questionRepository.save(question);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuestionResponse> getQuestionsByAssessment(Long assessmentId) {
        if (!assessmentRepository.existsById(assessmentId)) {
            throw new IllegalArgumentException("Assessment not found with id: " + assessmentId);
        }
        return questionRepository.findByAssessmentId(assessmentId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuestionResponse getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + id));
        return mapToResponse(question);
    }

    @Override
    @Transactional
    public QuestionResponse updateQuestion(Long id, QuestionRequest request, User currentUser) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + id));

        // Authorization check
        checkAuthorization(question.getAssessment(), currentUser);

        question.setText(request.getText());
        question.setType(request.getType());
        question.setPoints(request.getPoints());

        // Clear existing options (orphanRemoval=true will delete them) and add updated options
        question.getOptions().clear();
        List<QuestionOption> newOptions = request.getOptions().stream()
                .map(optReq -> QuestionOption.builder()
                        .text(optReq.getText())
                        .isCorrect(optReq.getIsCorrect())
                        .question(question)
                        .build())
                .collect(Collectors.toList());
        question.getOptions().addAll(newOptions);

        Question updated = questionRepository.save(question);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteQuestion(Long id, User currentUser) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Question not found with id: " + id));

        // Authorization check
        checkAuthorization(question.getAssessment(), currentUser);

        questionRepository.delete(question);
    }

    private void checkAuthorization(Assessment assessment, User currentUser) {
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean isCreator = assessment.getCreatedBy().getId().equals(currentUser.getId());

        if (!isAdmin && !isCreator) {
            throw new SecurityException("You are not authorized to modify questions for this assessment");
        }
    }

    private QuestionResponse mapToResponse(Question question) {
        List<QuestionOptionResponse> options = question.getOptions().stream()
                .map(opt -> QuestionOptionResponse.builder()
                        .id(opt.getId())
                        .text(opt.getText())
                        .isCorrect(opt.getIsCorrect())
                        .build())
                .collect(Collectors.toList());

        return QuestionResponse.builder()
                .id(question.getId())
                .text(question.getText())
                .type(question.getType())
                .points(question.getPoints())
                .assessmentId(question.getAssessment().getId())
                .options(options)
                .build();
    }
}
