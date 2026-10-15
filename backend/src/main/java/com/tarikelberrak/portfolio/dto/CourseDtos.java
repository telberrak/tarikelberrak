package com.tarikelberrak.portfolio.dto;

import java.util.List;
import java.util.UUID;

public class CourseDtos {

    public record CourseSummaryResponse(
            UUID id,
            String slug,
            String title,
            String description,
            String level,
            String category,
            int priceCents,
            boolean isFree,
            String coverImage,
            boolean published,
            boolean archived) {
    }

    public record CourseDetailResponse(
            UUID id,
            String slug,
            String title,
            String description,
            String level,
            String category,
            int priceCents,
            boolean isFree,
            String coverImage,
            boolean published,
            boolean archived,
            String content) {
    }

    public record CourseSectionResponse(UUID id, String title, int position) {
    }

    public record LessonSummaryResponse(
            UUID id,
            UUID sectionId,
            String slug,
            String title,
            int position,
            int durationSeconds,
            boolean isPreview,
            boolean completed,
            int watchedSeconds) {
    }

    public record CurriculumResponse(
            List<CourseSectionResponse> sections,
            List<LessonSummaryResponse> lessons) {
    }

    public record LessonAssetResponse(String provider, String videoAssetId) {
    }

    public record LessonDetailResponse(
            UUID id,
            String slug,
            String title,
            int durationSeconds,
            String notes,
            int watchedSeconds,
            boolean completed,
            LessonAssetResponse asset,
            String previousLessonSlug,
            String nextLessonSlug) {
    }
}
