package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.UUID;

public class CommentDtos {

    public record CommentRequest(
            @NotBlank String targetType,
            @NotBlank String targetSlug,
            UUID parentId,
            @NotBlank @Size(min = 2, max = 4000) String body) {
    }

    public record AuthorResponse(UUID id, String displayName, String avatarUrl) {
    }

    public record CommentResponse(
            UUID id,
            String body,
            Instant createdAt,
            UUID parentId,
            AuthorResponse author) {
    }
}
