package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.UUID;

public class AdminCourseDtos {

    private static final String SLUG_PATTERN = "^[a-z0-9]+(-[a-z0-9]+)*$";

    public record CourseWriteRequest(
            @NotBlank @Pattern(regexp = SLUG_PATTERN, message = "Use lowercase letters, numbers and hyphens only.")
            String slug,
            @NotBlank String title,
            @NotBlank String description,
            @NotBlank String level,
            @NotBlank String category,
            @Min(0) int priceCents,
            boolean isFree,
            String coverImage,
            boolean published) {
    }

    public record SectionWriteRequest(
            @NotBlank String title,
            @Min(0) int position) {
    }

    public record LessonWriteRequest(
            UUID sectionId,
            @NotBlank @Pattern(regexp = SLUG_PATTERN, message = "Use lowercase letters, numbers and hyphens only.")
            String slug,
            @NotBlank String title,
            @Min(0) int position,
            @Min(0) int durationSeconds,
            boolean isPreview,
            String notes,
            @NotBlank String videoProvider,
            @NotBlank String videoAssetId) {
    }

    public record AdminLessonResponse(
            UUID id,
            UUID sectionId,
            String slug,
            String title,
            int position,
            int durationSeconds,
            boolean isPreview,
            String notes,
            String videoProvider,
            String videoAssetId) {
    }

    public record AdminSectionResponse(UUID id, String title, int position) {
    }

    public record AdminCourseDetailResponse(
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
            java.util.List<AdminSectionResponse> sections,
            java.util.List<AdminLessonResponse> lessons) {
    }
}
