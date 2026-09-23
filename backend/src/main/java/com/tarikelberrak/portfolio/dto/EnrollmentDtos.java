package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.Instant;

public class EnrollmentDtos {

    public record EnrollFreeRequest(@NotBlank String courseSlug) {
    }

    public record EnrollmentStatusResponse(boolean enrolled, String source) {
    }

    public record EnrolledCourseResponse(
            CourseDtos.CourseSummaryResponse course,
            String source,
            Instant enrolledAt,
            int totalLessons,
            int completedLessons,
            double progressPercent,
            String continueLessonSlug) {
    }
}
