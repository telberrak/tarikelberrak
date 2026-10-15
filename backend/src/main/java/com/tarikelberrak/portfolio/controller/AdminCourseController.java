package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.AdminCourseDtos.*;
import com.tarikelberrak.portfolio.dto.CourseDtos.CourseSummaryResponse;
import com.tarikelberrak.portfolio.service.AdminCourseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/courses")
public class AdminCourseController {

    private final AdminCourseService adminCourseService;

    public AdminCourseController(AdminCourseService adminCourseService) {
        this.adminCourseService = adminCourseService;
    }

    @GetMapping
    public List<CourseSummaryResponse> list() {
        return adminCourseService.listAll();
    }

    @GetMapping("/{id}")
    public AdminCourseDetailResponse get(@PathVariable UUID id) {
        return adminCourseService.getDetail(id);
    }

    @PostMapping
    public CourseSummaryResponse create(@Valid @RequestBody CourseWriteRequest request) {
        return adminCourseService.createCourse(request);
    }

    @PutMapping("/{id}")
    public CourseSummaryResponse update(@PathVariable UUID id, @Valid @RequestBody CourseWriteRequest request) {
        return adminCourseService.updateCourse(id, request);
    }

    @PostMapping("/{id}/archive")
    public CourseSummaryResponse archive(@PathVariable UUID id) {
        return adminCourseService.setArchived(id, true);
    }

    @PostMapping("/{id}/unarchive")
    public CourseSummaryResponse unarchive(@PathVariable UUID id) {
        return adminCourseService.setArchived(id, false);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        adminCourseService.deleteCourse(id);
    }

    @PostMapping("/{courseId}/sections")
    public AdminSectionResponse createSection(
            @PathVariable UUID courseId, @Valid @RequestBody SectionWriteRequest request) {
        return adminCourseService.createSection(courseId, request);
    }

    @PutMapping("/sections/{sectionId}")
    public AdminSectionResponse updateSection(
            @PathVariable UUID sectionId, @Valid @RequestBody SectionWriteRequest request) {
        return adminCourseService.updateSection(sectionId, request);
    }

    @DeleteMapping("/sections/{sectionId}")
    public void deleteSection(@PathVariable UUID sectionId) {
        adminCourseService.deleteSection(sectionId);
    }

    @PostMapping("/{courseId}/lessons")
    public AdminLessonResponse createLesson(
            @PathVariable UUID courseId, @Valid @RequestBody LessonWriteRequest request) {
        return adminCourseService.createLesson(courseId, request);
    }

    @PutMapping("/lessons/{lessonId}")
    public AdminLessonResponse updateLesson(
            @PathVariable UUID lessonId, @Valid @RequestBody LessonWriteRequest request) {
        return adminCourseService.updateLesson(lessonId, request);
    }

    @DeleteMapping("/lessons/{lessonId}")
    public void deleteLesson(@PathVariable UUID lessonId) {
        adminCourseService.deleteLesson(lessonId);
    }
}
