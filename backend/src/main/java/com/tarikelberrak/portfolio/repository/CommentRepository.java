package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.Comment;
import com.tarikelberrak.portfolio.domain.CommentTargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByTargetTypeAndTargetSlugAndStatusOrderByCreatedAtAsc(
            CommentTargetType targetType, String targetSlug, com.tarikelberrak.portfolio.domain.CommentStatus status);
}
