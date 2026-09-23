package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByPublishedTrueOrderByCreatedAtAsc();
    List<Course> findAllByOrderByCreatedAtAsc();
    Optional<Course> findBySlugAndPublishedTrue(String slug);
    boolean existsBySlug(String slug);
}
