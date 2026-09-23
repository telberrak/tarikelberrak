package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.*;
import com.tarikelberrak.portfolio.dto.CommentDtos.*;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.CommentRepository;
import com.tarikelberrak.portfolio.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> list(String targetType, String targetSlug) {
        CommentTargetType type = parseTargetType(targetType);

        return commentRepository
                .findByTargetTypeAndTargetSlugAndStatusOrderByCreatedAtAsc(type, targetSlug, CommentStatus.visible)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CommentResponse post(UUID userId, CommentRequest request) {
        CommentTargetType type = parseTargetType(request.targetType());
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.unauthorized("Sign in to comment."));

        Comment parent = null;
        if (request.parentId() != null) {
            parent = commentRepository.findById(request.parentId())
                    .orElseThrow(() -> ApiException.badRequest("The comment you're replying to no longer exists."));
        }

        Comment comment = Comment.builder()
                .user(user)
                .targetType(type)
                .targetSlug(request.targetSlug())
                .parent(parent)
                .body(request.body())
                .status(CommentStatus.visible)
                .build();

        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    private CommentTargetType parseTargetType(String value) {
        try {
            return CommentTargetType.valueOf(value);
        } catch (IllegalArgumentException e) {
            throw ApiException.badRequest("Invalid comment target type.");
        }
    }

    private CommentResponse toResponse(Comment c) {
        User author = c.getUser();
        return new CommentResponse(
                c.getId(),
                c.getBody(),
                c.getCreatedAt(),
                c.getParent() != null ? c.getParent().getId() : null,
                new AuthorResponse(author.getId(), author.getDisplayName(), author.getAvatarUrl()));
    }
}
