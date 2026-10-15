package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.*;
import com.tarikelberrak.portfolio.dto.AdminCourseDtos.*;
import com.tarikelberrak.portfolio.dto.CourseDtos.CourseSummaryResponse;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminCourseService {

    private final CourseRepository courseRepository;
    private final CourseSectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final LessonAssetRepository lessonAssetRepository;

    public AdminCourseService(
            CourseRepository courseRepository,
            CourseSectionRepository sectionRepository,
            LessonRepository lessonRepository,
            LessonAssetRepository lessonAssetRepository) {
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.lessonRepository = lessonRepository;
        this.lessonAssetRepository = lessonAssetRepository;
    }

    @Transactional(readOnly = true)
    public List<CourseSummaryResponse> listAll() {
        return courseRepository.findAllByOrderByCreatedAtAsc().stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public AdminCourseDetailResponse getDetail(UUID courseId) {
        Course course = findCourseOrThrow(courseId);
        List<CourseSection> sections = sectionRepository.findByCourseIdOrderByPositionAsc(courseId);
        List<Lesson> lessons = lessonRepository.findByCourseIdOrderByPositionAsc(courseId);

        Map<UUID, LessonAsset> assetsByLesson = lessons.isEmpty()
                ? Map.of()
                : lessons.stream()
                        .map(l -> lessonAssetRepository.findByLessonId(l.getId()).orElse(null))
                        .filter(a -> a != null)
                        .collect(Collectors.toMap(a -> a.getLessonId(), a -> a));

        return new AdminCourseDetailResponse(
                course.getId(), course.getSlug(), course.getTitle(), course.getDescription(),
                course.getLevel().name(), course.getCategory(), course.getPriceCents(), course.getIsFree(),
                course.getCoverImage(), course.getPublished(), course.getArchived(), course.getContent(),
                sections.stream().map(s -> new AdminSectionResponse(s.getId(), s.getTitle(), s.getPosition())).toList(),
                lessons.stream().map(l -> toLessonResponse(l, assetsByLesson.get(l.getId()))).toList());
    }

    @Transactional
    public CourseSummaryResponse createCourse(CourseWriteRequest request) {
        if (courseRepository.existsBySlug(request.slug())) {
            throw ApiException.conflict("A course with this slug already exists.");
        }
        Course course = Course.builder()
                .slug(request.slug())
                .title(request.title())
                .description(request.description())
                .level(parseLevel(request.level()))
                .category(request.category())
                .priceCents(ContentAccessService.validatedPriceCents(request.isFree(), request.priceCents()))
                .isFree(request.isFree())
                .coverImage(request.coverImage())
                .published(request.published())
                .content(request.content() != null ? request.content() : "")
                .build();
        return toSummary(courseRepository.save(course));
    }

    @Transactional
    public CourseSummaryResponse updateCourse(UUID courseId, CourseWriteRequest request) {
        Course course = findCourseOrThrow(courseId);

        if (!course.getSlug().equals(request.slug()) && courseRepository.existsBySlug(request.slug())) {
            throw ApiException.conflict("A course with this slug already exists.");
        }

        course.setSlug(request.slug());
        course.setTitle(request.title());
        course.setDescription(request.description());
        course.setLevel(parseLevel(request.level()));
        course.setCategory(request.category());
        course.setPriceCents(ContentAccessService.validatedPriceCents(request.isFree(), request.priceCents()));
        course.setIsFree(request.isFree());
        course.setCoverImage(request.coverImage());
        course.setPublished(request.published());
        if (request.content() != null) course.setContent(request.content());

        return toSummary(courseRepository.save(course));
    }

    @Transactional
    public CourseSummaryResponse setArchived(UUID courseId, boolean archived) {
        Course course = findCourseOrThrow(courseId);
        course.setArchived(archived);
        return toSummary(courseRepository.save(course));
    }

    @Transactional
    public void deleteCourse(UUID courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw ApiException.notFound("Course not found.");
        }
        courseRepository.deleteById(courseId);
    }

    @Transactional
    public AdminSectionResponse createSection(UUID courseId, SectionWriteRequest request) {
        Course course = findCourseOrThrow(courseId);
        CourseSection section = CourseSection.builder()
                .course(course)
                .title(request.title())
                .position(request.position())
                .build();
        section = sectionRepository.save(section);
        return new AdminSectionResponse(section.getId(), section.getTitle(), section.getPosition());
    }

    @Transactional
    public AdminSectionResponse updateSection(UUID sectionId, SectionWriteRequest request) {
        CourseSection section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> ApiException.notFound("Section not found."));
        section.setTitle(request.title());
        section.setPosition(request.position());
        section = sectionRepository.save(section);
        return new AdminSectionResponse(section.getId(), section.getTitle(), section.getPosition());
    }

    @Transactional
    public void deleteSection(UUID sectionId) {
        if (!sectionRepository.existsById(sectionId)) {
            throw ApiException.notFound("Section not found.");
        }
        sectionRepository.deleteById(sectionId);
    }

    @Transactional
    public AdminLessonResponse createLesson(UUID courseId, LessonWriteRequest request) {
        Course course = findCourseOrThrow(courseId);

        CourseSection section = null;
        if (request.sectionId() != null) {
            section = sectionRepository.findById(request.sectionId())
                    .orElseThrow(() -> ApiException.notFound("Section not found."));
        }

        Lesson lesson = Lesson.builder()
                .course(course)
                .section(section)
                .slug(request.slug())
                .title(request.title())
                .position(request.position())
                .durationSeconds(request.durationSeconds())
                .isPreview(request.isPreview())
                .notes(request.notes())
                .build();
        lesson = lessonRepository.save(lesson);

        LessonAsset asset = LessonAsset.builder()
                .lesson(lesson)
                .provider(parseProvider(request.videoProvider()))
                .videoAssetId(request.videoAssetId())
                .build();
        asset = lessonAssetRepository.save(asset);

        return toLessonResponse(lesson, asset);
    }

    @Transactional
    public AdminLessonResponse updateLesson(UUID lessonId, LessonWriteRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> ApiException.notFound("Lesson not found."));

        CourseSection section = null;
        if (request.sectionId() != null) {
            section = sectionRepository.findById(request.sectionId())
                    .orElseThrow(() -> ApiException.notFound("Section not found."));
        }

        lesson.setSection(section);
        lesson.setSlug(request.slug());
        lesson.setTitle(request.title());
        lesson.setPosition(request.position());
        lesson.setDurationSeconds(request.durationSeconds());
        lesson.setIsPreview(request.isPreview());
        lesson.setNotes(request.notes());
        final Lesson savedLesson = lessonRepository.save(lesson);
        lesson = savedLesson;

        LessonAsset asset = lessonAssetRepository.findByLessonId(lessonId)
                .orElseGet(() -> LessonAsset.builder().lesson(savedLesson).build());
        asset.setProvider(parseProvider(request.videoProvider()));
        asset.setVideoAssetId(request.videoAssetId());
        asset = lessonAssetRepository.save(asset);

        return toLessonResponse(lesson, asset);
    }

    @Transactional
    public void deleteLesson(UUID lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw ApiException.notFound("Lesson not found.");
        }
        lessonRepository.deleteById(lessonId);
    }

    private Course findCourseOrThrow(UUID courseId) {
        return courseRepository.findById(courseId).orElseThrow(() -> ApiException.notFound("Course not found."));
    }

    private CourseLevel parseLevel(String value) {
        try {
            return CourseLevel.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest("Invalid level — use beginner, intermediate or advanced.");
        }
    }

    private VideoProvider parseProvider(String value) {
        try {
            return VideoProvider.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest("Invalid video provider — use html5 or mux.");
        }
    }

    private AdminLessonResponse toLessonResponse(Lesson l, LessonAsset asset) {
        return new AdminLessonResponse(
                l.getId(),
                l.getSection() != null ? l.getSection().getId() : null,
                l.getSlug(), l.getTitle(), l.getPosition(), l.getDurationSeconds(), l.getIsPreview(), l.getNotes(),
                asset != null ? asset.getProvider().name() : null,
                asset != null ? asset.getVideoAssetId() : null);
    }

    private CourseSummaryResponse toSummary(Course c) {
        return new CourseSummaryResponse(
                c.getId(), c.getSlug(), c.getTitle(), c.getDescription(), c.getLevel().name(),
                c.getCategory(), c.getPriceCents(), c.getIsFree(), c.getCoverImage(), c.getPublished(), c.getArchived());
    }
}
