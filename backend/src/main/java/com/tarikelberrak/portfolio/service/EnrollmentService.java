package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.*;
import com.tarikelberrak.portfolio.dto.CourseDtos.CourseSummaryResponse;
import com.tarikelberrak.portfolio.dto.EnrollmentDtos.EnrolledCourseResponse;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository progressRepository;

    public EnrollmentService(
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            LessonRepository lessonRepository,
            LessonProgressRepository progressRepository) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.lessonRepository = lessonRepository;
        this.progressRepository = progressRepository;
    }

    @Transactional
    public void enrollFree(UUID userId, String courseSlug) {
        Course course = courseRepository.findBySlugAndPublishedTrueAndArchivedFalse(courseSlug)
                .orElseThrow(() -> ApiException.notFound("Course not found."));

        if (!course.getIsFree()) {
            throw ApiException.badRequest("This course is not available for free enrollment.");
        }

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, course.getId())) {
            return;
        }

        User user = userRepository.getReferenceById(userId);
        Enrollment enrollment = Enrollment.builder()
                .user(user)
                .course(course)
                .source(EnrollmentSource.free)
                .build();
        enrollmentRepository.save(enrollment);
    }

    @Transactional(readOnly = true)
    public com.tarikelberrak.portfolio.dto.EnrollmentDtos.EnrollmentStatusResponse getStatus(UUID userId, String courseSlug) {
        Course course = courseRepository.findBySlugAndPublishedTrue(courseSlug)
                .orElseThrow(() -> ApiException.notFound("Course not found."));

        return enrollmentRepository.findByUserIdAndCourseId(userId, course.getId())
                .map(e -> new com.tarikelberrak.portfolio.dto.EnrollmentDtos.EnrollmentStatusResponse(true, e.getSource().name()))
                .orElse(new com.tarikelberrak.portfolio.dto.EnrollmentDtos.EnrollmentStatusResponse(false, null));
    }

    @Transactional(readOnly = true)
    public List<EnrolledCourseResponse> listMyEnrollments(UUID userId) {
        List<Enrollment> enrollments = enrollmentRepository.findByUserIdOrderByCreatedAtDesc(userId);

        return enrollments.stream().map(enrollment -> {
            Course course = enrollment.getCourse();
            List<Lesson> lessons = lessonRepository.findByCourseIdOrderByPositionAsc(course.getId());

            Map<UUID, LessonProgress> progressByLesson = progressRepository
                    .findByUserIdAndLessonIdIn(userId, lessons.stream().map(Lesson::getId).toList())
                    .stream()
                    .collect(Collectors.toMap(p -> p.getLesson().getId(), p -> p));

            long completedCount = lessons.stream()
                    .filter(l -> {
                        LessonProgress p = progressByLesson.get(l.getId());
                        return p != null && p.getCompleted();
                    })
                    .count();

            double percent = lessons.isEmpty() ? 0 : (completedCount * 100.0) / lessons.size();

            String continueSlug = lessons.stream()
                    .filter(l -> {
                        LessonProgress p = progressByLesson.get(l.getId());
                        return p == null || !p.getCompleted();
                    })
                    .findFirst()
                    .or(() -> lessons.stream().findFirst())
                    .map(Lesson::getSlug)
                    .orElse(null);

            CourseSummaryResponse courseSummary = new CourseSummaryResponse(
                    course.getId(), course.getSlug(), course.getTitle(), course.getDescription(),
                    course.getLevel().name(), course.getCategory(), course.getPriceCents(),
                    course.getIsFree(), course.getCoverImage(), course.getPublished(), course.getArchived());

            return new EnrolledCourseResponse(
                    courseSummary,
                    enrollment.getSource().name(),
                    enrollment.getCreatedAt(),
                    lessons.size(),
                    (int) completedCount,
                    percent,
                    continueSlug);
        }).toList();
    }
}
