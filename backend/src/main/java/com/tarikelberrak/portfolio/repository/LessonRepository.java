package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonRepository extends JpaRepository<Lesson, UUID> {
    List<Lesson> findByCourseIdOrderByPositionAsc(UUID courseId);
    Optional<Lesson> findByCourseIdAndSlug(UUID courseId, String slug);
}
