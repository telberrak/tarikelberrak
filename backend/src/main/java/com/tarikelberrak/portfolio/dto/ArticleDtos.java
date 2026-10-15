package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class ArticleDtos {

    private static final String SLUG_PATTERN = "^[a-z0-9]+(-[a-z0-9]+)*$";

    public record ArticleSummaryResponse(
            UUID id,
            String slug,
            String title,
            String excerpt,
            LocalDate date,
            int readMinutes,
            List<String> tags,
            String author,
            String icon,
            boolean published,
            boolean archived,
            int priceCents,
            boolean isFree) {
    }

    public record ArticleDetailResponse(
            UUID id,
            String slug,
            String title,
            String excerpt,
            String content,
            LocalDate date,
            int readMinutes,
            List<String> tags,
            String author,
            String icon,
            boolean published,
            boolean archived,
            String contentFormat,
            int priceCents,
            boolean isFree,
            boolean locked) {
    }

    public record ArticleWriteRequest(
            @NotBlank @Pattern(regexp = SLUG_PATTERN, message = "Use lowercase letters, numbers and hyphens only.")
            String slug,
            @NotBlank String title,
            @NotBlank String excerpt,
            @NotBlank String content,
            LocalDate date,
            @Min(1) int readMinutes,
            List<String> tags,
            @NotBlank String author,
            @NotBlank String icon,
            boolean published,
            String contentFormat,
            @Min(0) int priceCents,
            boolean isFree) {
    }
}
