package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.LessonAsset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LessonAssetRepository extends JpaRepository<LessonAsset, UUID> {
    Optional<LessonAsset> findByLessonId(UUID lessonId);
}
