package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.ProgressDtos.*;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping
    public ProgressUpdateResponse report(
            @Valid @RequestBody ProgressUpdateRequest request,
            @AuthenticationPrincipal AuthPrincipal principal) {
        boolean completed = progressService.reportProgress(
                principal.userId(), request.lessonId(), request.watchedSeconds(), request.durationSeconds());
        return new ProgressUpdateResponse(true, completed);
    }

    @PostMapping("/{lessonId}/complete")
    public ProgressUpdateResponse markComplete(
            @PathVariable UUID lessonId,
            @AuthenticationPrincipal AuthPrincipal principal) {
        progressService.markComplete(principal.userId(), lessonId);
        return new ProgressUpdateResponse(true, true);
    }
}
