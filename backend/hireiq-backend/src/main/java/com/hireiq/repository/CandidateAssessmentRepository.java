package com.hireiq.repository;

import com.hireiq.entity.CandidateAssessment;
import com.hireiq.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.hireiq.entity.CandidateAssessmentStatus;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface CandidateAssessmentRepository extends JpaRepository<CandidateAssessment, Long> {
    
    List<CandidateAssessment> findByCandidate(User candidate);

    Long countByAssessmentId(Long assessmentId);

    Long countByAssessmentIdAndStatus(Long assessmentId, CandidateAssessmentStatus status);

    Long countByAssessmentIdAndStatusAndScoreGreaterThanEqual(Long assessmentId, CandidateAssessmentStatus status, Integer passThreshold);

    @Query("SELECT AVG(ca.score), MAX(ca.score), MIN(ca.score) FROM CandidateAssessment ca WHERE ca.assessment.id = :assessmentId AND ca.status = 'SUBMITTED'")
    List<Object[]> getAssessmentScoreStats(@Param("assessmentId") Long assessmentId);

    @Query("SELECT COUNT(ca) FROM CandidateAssessment ca WHERE ca.assessment.createdBy.id = :userId")
    Long countAttemptsByRecruiterId(@Param("userId") Long userId);

    @Query("SELECT AVG(ca.score) FROM CandidateAssessment ca WHERE ca.assessment.createdBy.id = :userId AND ca.status = 'SUBMITTED'")
    Double getAverageScoreByRecruiterId(@Param("userId") Long userId);

    @Query("SELECT AVG(ca.score) FROM CandidateAssessment ca WHERE ca.status = 'SUBMITTED'")
    Double getGlobalAverageScore();
}
