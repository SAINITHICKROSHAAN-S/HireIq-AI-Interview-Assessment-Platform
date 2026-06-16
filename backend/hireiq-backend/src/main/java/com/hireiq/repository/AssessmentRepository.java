package com.hireiq.repository;

import com.hireiq.entity.Assessment;
import com.hireiq.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    
    List<Assessment> findByCreatedBy(User createdBy);

    Long countByCreatedById(Long userId);
}
