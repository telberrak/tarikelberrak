package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.CommentDtos.*;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<CommentResponse> list(
            @RequestParam String targetType,
            @RequestParam String targetSlug) {
        return commentService.list(targetType, targetSlug);
    }

    @PostMapping
    public CommentResponse post(
            @Valid @RequestBody CommentRequest request,
            @AuthenticationPrincipal AuthPrincipal principal) {
        return commentService.post(principal.userId(), request);
    }
}
