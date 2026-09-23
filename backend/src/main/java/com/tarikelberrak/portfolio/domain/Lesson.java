package com.tarikelberrak.portfolio.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "lessons", uniqueConstraints = @UniqueConstraint(columnNames = {"course_id", "slug"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private CourseSection section;

    @Column(nullable = false)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "is_preview", nullable = false)
    private Boolean isPreview;

    @Column(columnDefinition = "text")
    private String notes;
}
