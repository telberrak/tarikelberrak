package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {
    List<CourseSection> findByCourseIdOrderByPositionAsc(UUID courseId);
}
