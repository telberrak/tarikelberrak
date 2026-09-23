package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.AbstractIntegrationTest;
import com.tarikelberrak.portfolio.domain.*;
import com.tarikelberrak.portfolio.dto.CourseDtos.LessonDetailResponse;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.CourseRepository;
import com.tarikelberrak.portfolio.repository.EnrollmentRepository;
import com.tarikelberrak.portfolio.repository.LessonRepository;
import com.tarikelberrak.portfolio.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Covers the paywall gating in CourseService.getLessonDetail — the one piece
 * of logic standing between a lesson and someone who hasn't paid for it.
 */
class CourseServiceTest extends AbstractIntegrationTest {

    @Autowired
    private CourseService courseService;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    @Autowired
    private UserRepository userRepository;

    private Course course;
    private Lesson previewLesson;
    private Lesson paidLesson;
    private User user;

    @BeforeEach
    void setUp() {
        course = courseRepository.save(Course.builder()
                .slug("test-course-" + UUID.randomUUID())
                .title("Test Course")
                .description("A course for testing.")
                .level(CourseLevel.beginner)
                .category("testing")
                .priceCents(4900)
                .isFree(false)
                .published(true)
                .build());

        previewLesson = lessonRepository.save(Lesson.builder()
                .course(course)
                .slug("preview-lesson")
                .title("Preview Lesson")
                .position(0)
                .durationSeconds(120)
                .isPreview(true)
                .build());

        paidLesson = lessonRepository.save(Lesson.builder()
                .course(course)
                .slug("paid-lesson")
                .title("Paid Lesson")
                .position(1)
                .durationSeconds(300)
                .isPreview(false)
                .build());

        user = userRepository.save(User.builder()
                .email("student-" + UUID.randomUUID() + "@example.com")
                .passwordHash("irrelevant-for-this-test")
                .displayName("Student")
                .build());
    }

    @Test
    void anonymousVisitorsCannotViewEvenAPreviewLesson() {
        assertThatThrownBy(() -> courseService.getLessonDetail(course.getSlug(), previewLesson.getSlug(), null))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Sign in");
    }

    @Test
    void signedInButNotEnrolledCanWatchAPreviewLesson() {
        LessonDetailResponse response =
                courseService.getLessonDetail(course.getSlug(), previewLesson.getSlug(), user.getId());

        assertThat(response.slug()).isEqualTo("preview-lesson");
    }

    @Test
    void signedInButNotEnrolledCannotWatchANonPreviewLesson() {
        assertThatThrownBy(() -> courseService.getLessonDetail(course.getSlug(), paidLesson.getSlug(), user.getId()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Enroll");
    }

    @Test
    void enrolledUserCanWatchTheNonPreviewLesson() {
        enrollmentRepository.save(Enrollment.builder()
                .user(user)
                .course(course)
                .source(EnrollmentSource.stripe)
                .build());

        LessonDetailResponse response =
                courseService.getLessonDetail(course.getSlug(), paidLesson.getSlug(), user.getId());

        assertThat(response.slug()).isEqualTo("paid-lesson");
    }
}
