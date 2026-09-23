package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ProgressDtos {

    public record ProgressUpdateRequest(
            @NotNull UUID lessonId,
            @Min(0) int watchedSeconds,
            @Min(0) int durationSeconds) {
    }

    public record ProgressUpdateResponse(boolean ok, boolean completed) {
    }
}
