package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.*;
import com.tarikelberrak.portfolio.dto.CourseDtos.*;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final LessonAssetRepository lessonAssetRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonProgressRepository progressRepository;

    public CourseService(
            CourseRepository courseRepository,
            CourseSectionRepository sectionRepository,
            LessonRepository lessonRepository,
            LessonAssetRepository lessonAssetRepository,
            EnrollmentRepository enrollmentRepository,
            LessonProgressRepository progressRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.lessonAssetRepository = lessonAssetRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.progressRepository = progressRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseSummaryResponse> listPublished() {
        return courseRepository.findByPublishedTrueOrderByCreatedAtAsc().stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public CourseSummaryResponse getBySlug(String slug) {
        return toSummary(findPublishedCourse(slug));
    }

    @Transactional(readOnly = true)
    public CurriculumResponse getCurriculum(String courseSlug, UUID userId) {
        Course course = findPublishedCourse(courseSlug);

        List<CourseSection> sections = sectionRepository.findByCourseIdOrderByPositionAsc(course.getId());
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByPositionAsc(course.getId());

        Map<UUID, LessonProgress> progressByLesson = userId == null
                ? Map.of()
                : progressRepository
                        .findByUserIdAndLessonIdIn(userId, lessons.stream().map(Lesson::getId).toList())
                        .stream()
                        .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

        List<CourseSectionResponse> sectionResponses = sections.stream()
                .map(s -> new CourseSectionResponse(s.getId(), s.getTitle(), s.getPosition()))
                .toList();

        List<LessonSummaryResponse> lessonResponses = lessons.stream()
                .map(l -> {
                    LessonProgress progress = progressByLesson.get(l.getId());
                    return new LessonSummaryResponse(
                            l.getId(),
                            l.getSection() != null ? l.getSection().getId() : null,
                            l.getSlug(),
                            l.getTitle(),
                            l.getPosition(),
                            l.getDurationSeconds(),
                            l.getIsPreview(),
                            progress != null && progress.getCompleted(),
                            progress != null ? progress.getWatchedSeconds() : 0);
                })
                .toList();

        return new CurriculumResponse(sectionResponses, lessonResponses);
    }

    @Transactional(readOnly = true)
    public LessonDetailResponse getLessonDetail(String courseSlug, String lessonSlug, UUID userId) {
        Course course = findPublishedCourse(courseSlug);
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByPositionAsc(course.getId());

        Lesson lesson = lessons.stream()
                .filter(l -> l.getSlug().equals(lessonSlug))
                .findFirst()
                .orElseThrow(() -> ApiException.notFound("Lesson not found."));

        boolean isEnrolled = userId != null && enrollmentRepository.existsByUserIdAndCourseId(userId, course.getId());

        if (!isEnrolled && !lesson.getIsPreview()) {
            throw ApiException.forbidden("Enroll in this course to access this lesson.");
        }
        if (userId == null) {
            throw ApiException.unauthorized("Sign in to view this lesson.");
        }

        LessonAsset asset = lessonAssetRepository.findByLessonId(lesson.getId()).orElse(null);

        LessonProgress progress = progressRepository.findByUserIdAndLessonId(userId, lesson.getId()).orElse(null);

        int index = lessons.indexOf(lesson);
        String previousSlug = index > 0 ? lessons.get(index - 1).getSlug() : null;
        String nextSlug = index < lessons.size() - 1 ? lessons.get(index + 1).getSlug() : null;

        return new LessonDetailResponse(
                lesson.getId(),
                lesson.getSlug(),
                lesson.getTitle(),
                lesson.getDurationSeconds(),
                lesson.getNotes(),
                progress != null ? progress.getWatchedSeconds() : 0,
                progress != null && progress.getCompleted(),
                asset != null ? new LessonAssetResponse(asset.getProvider().name(), asset.getVideoAssetId()) : null,
                previousSlug,
                nextSlug);
    }

    Course findPublishedCourse(String slug) {
        return courseRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> ApiException.notFound("Course not found."));
    }

    private CourseSummaryResponse toSummary(Course c) {
        return new CourseSummaryResponse(
                c.getId(), c.getSlug(), c.getTitle(), c.getDescription(), c.getLevel().name(),
                c.getCategory(), c.getPriceCents(), c.getIsFree(), c.getCoverImage(), c.getPublished());
    }
}
