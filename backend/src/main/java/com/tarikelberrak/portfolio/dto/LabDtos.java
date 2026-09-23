package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class LabDtos {

    private static final String SLUG_PATTERN = "^[a-z0-9]+(-[a-z0-9]+)*$";

    public record LabSummaryResponse(
            UUID id,
            String slug,
            String title,
            String excerpt,
            String status,
            String category,
            List<String> tags,
            String icon,
            LocalDate date,
            boolean published) {
    }

    public record LabDetailResponse(
            UUID id,
            String slug,
            String title,
            String excerpt,
            String content,
            String status,
            String category,
            List<String> tags,
            String icon,
            LocalDate date,
            boolean published) {
    }

    public record LabWriteRequest(
            @NotBlank @Pattern(regexp = SLUG_PATTERN, message = "Use lowercase letters, numbers and hyphens only.")
            String slug,
            @NotBlank String title,
            @NotBlank String excerpt,
            @NotBlank String content,
            @NotBlank String status,
            @NotBlank String category,
            List<String> tags,
            @NotBlank String icon,
            LocalDate date,
            boolean published) {
    }
}
