package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    List<Article> findByPublishedTrueOrderByArticleDateDesc();
    List<Article> findAllByOrderByArticleDateDesc();
    Optional<Article> findBySlugAndPublishedTrue(String slug);
    Optional<Article> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
