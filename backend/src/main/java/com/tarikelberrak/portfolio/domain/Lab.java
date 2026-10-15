package com.tarikelberrak.portfolio.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "labs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lab {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "text")
    private String excerpt;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    /** One of: Live | In Progress | Case Study | Prototype */
    @Column(nullable = false)
    private String status;

    /** One of: AI & LLM | Cloud & Kubernetes | Trading & Quant | Event-Driven */
    @Column(nullable = false)
    private String category;

    /** Comma-separated tag list — kept simple rather than a join table. */
    @Column(nullable = false)
    private String tags;

    @Column(nullable = false)
    private String icon;

    @Column(name = "lab_date", nullable = false)
    private LocalDate labDate;

    @Column(nullable = false)
    @Builder.Default
    private Boolean published = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean archived = false;

    /** Price in US cents; 0 when free. */
    @Column(name = "price_cents", nullable = false)
    @Builder.Default
    private Integer priceCents = 0;

    @Column(name = "is_free", nullable = false)
    @Builder.Default
    private Boolean isFree = true;

    /** "markdown" (legacy/seeded) or "html" (rich-text editor). */
    @Column(name = "content_format", nullable = false)
    @Builder.Default
    private String contentFormat = "html";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
