package com.hireiq.repository;

import com.hireiq.entity.CandidateAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateAnswerRepository extends JpaRepository<CandidateAnswer, Long> {
    
    Optional<CandidateAnswer> findByCandidateAssessmentIdAndQuestionId(Long attemptId, Long questionId);

    Long countByQuestionId(Long questionId);

    @Query("SELECT COUNT(ca) FROM CandidateAnswer ca WHERE ca.question.id = :questionId AND ca.selectedOption.isCorrect = true")
    Long countCorrectAnswersByQuestionId(@Param("questionId") Long questionId);

    @Query("SELECT ca.question.id, ca.question.text, COUNT(ca), " +
           "SUM(CASE WHEN ca.selectedOption.isCorrect = true THEN 1.0 ELSE 0.0 END) " +
           "FROM CandidateAnswer ca " +
           "WHERE ca.question.assessment.createdBy.id = :userId " +
           "GROUP BY ca.question.id, ca.question.text")
    List<Object[]> getQuestionAccuracyStatsByRecruiter(@Param("userId") Long userId);

    @Query("SELECT ca.question.id, ca.question.text, COUNT(ca), " +
           "SUM(CASE WHEN ca.selectedOption.isCorrect = true THEN 1.0 ELSE 0.0 END) " +
           "FROM CandidateAnswer ca " +
           "GROUP BY ca.question.id, ca.question.text")
    List<Object[]> getGlobalQuestionAccuracyStats();
}
