package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.CourseDtos.*;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.service.CourseService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<CourseSummaryResponse> list() {
        return courseService.listPublished();
    }

    @GetMapping("/{slug}")
    public CourseDetailResponse getBySlug(@PathVariable String slug) {
        return courseService.getBySlug(slug);
    }

    @GetMapping("/{slug}/curriculum")
    public CurriculumResponse getCurriculum(
            @PathVariable String slug,
            @AuthenticationPrincipal AuthPrincipal principal) {
        UUID userId = principal != null ? principal.userId() : null;
        return courseService.getCurriculum(slug, userId);
    }

    @GetMapping("/{slug}/lessons/{lessonSlug}")
    public LessonDetailResponse getLesson(
            @PathVariable String slug,
            @PathVariable String lessonSlug,
            @AuthenticationPrincipal AuthPrincipal principal) {
        UUID userId = principal != null ? principal.userId() : null;
        return courseService.getLessonDetail(slug, lessonSlug, userId);
    }
}
