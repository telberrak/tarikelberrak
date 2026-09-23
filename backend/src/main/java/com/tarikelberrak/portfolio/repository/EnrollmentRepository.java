package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<Enrollment, UUID> {
    Optional<Enrollment> findByUserIdAndCourseId(UUID userId, UUID courseId);
    boolean existsByUserIdAndCourseId(UUID userId, UUID courseId);
    List<Enrollment> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
