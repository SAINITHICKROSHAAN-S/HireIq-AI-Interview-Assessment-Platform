package com.hireiq.repository;

import com.hireiq.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    List<Question> findByAssessmentId(Long assessmentId);

    @Query("SELECT COUNT(q) FROM Question q WHERE q.assessment.createdBy.id = :userId")
    Long countQuestionsByRecruiterId(@Param("userId") Long userId);
}
