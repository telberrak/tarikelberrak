package com.tarikelberrak.portfolio.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "contact_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactSubmission {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "text")
    private String message;

    /** One of "new", "read", "archived" — plain string since "new" is a Java keyword. */
    @Column(nullable = false)
    @Builder.Default
    private String status = "new";

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
