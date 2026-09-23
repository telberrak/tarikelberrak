package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, UUID> {
    Optional<LessonProgress> findByUserIdAndLessonId(UUID userId, UUID lessonId);
    List<LessonProgress> findByUserIdAndLessonIdIn(UUID userId, List<UUID> lessonIds);
}
