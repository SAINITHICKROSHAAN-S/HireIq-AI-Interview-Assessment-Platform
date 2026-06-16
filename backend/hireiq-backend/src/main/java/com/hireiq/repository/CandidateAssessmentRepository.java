package com.hireiq.repository;

import com.hireiq.entity.CandidateAssessment;
import com.hireiq.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CandidateAssessmentRepository extends JpaRepository<CandidateAssessment, Long> {
    
    List<CandidateAssessment> findByCandidate(User candidate);
}
