package com.tarikelberrak.portfolio.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "lesson_assets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonAsset {

    @Id
    @Column(name = "lesson_id")
    private UUID lessonId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VideoProvider provider;

    @Column(name = "video_asset_id", nullable = false, columnDefinition = "text")
    private String videoAssetId;
}
