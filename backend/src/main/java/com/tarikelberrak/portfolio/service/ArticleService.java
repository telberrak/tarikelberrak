package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.Article;
import com.tarikelberrak.portfolio.domain.ContentType;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.dto.ArticleDtos.*;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.ArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ArticleService {

    private final ArticleRepository repository;

    private final ContentAccessService access;

    public ArticleService(ArticleRepository repository, ContentAccessService access) {
        this.repository = repository;
        this.access = access;
    }

    @Transactional(readOnly = true)
    public List<ArticleSummaryResponse> listPublished() {
        return repository.findByPublishedTrueAndArchivedFalseOrderByArticleDateDesc().stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public ArticleDetailResponse getPublishedBySlug(String slug, AuthPrincipal principal) {
        Article article = repository.findBySlugAndPublishedTrueAndArchivedFalse(slug)
                .orElseThrow(() -> ApiException.notFound("Article not found."));
        boolean locked = access.isLocked(
                principal, ContentType.article, article.getId(), article.getIsFree(), article.getPriceCents());
        return toDetail(article, locked);
    }

    @Transactional(readOnly = true)
    public List<ArticleSummaryResponse> adminList() {
        return repository.findAllByOrderByArticleDateDesc().stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public ArticleDetailResponse adminGet(UUID id) {
        return toDetail(findOrThrow(id));
    }

    @Transactional
    public ArticleDetailResponse create(ArticleWriteRequest request) {
        if (repository.existsBySlug(request.slug())) {
            throw ApiException.conflict("An article with this slug already exists.");
        }
        Article article = Article.builder()
                .slug(request.slug())
                .title(request.title())
                .excerpt(request.excerpt())
                .content(request.content())
                .contentFormat(normalizeFormat(request.contentFormat(), "html"))
                .articleDate(request.date() != null ? request.date() : LocalDate.now())
                .readMinutes(request.readMinutes())
                .tags(joinTags(request.tags()))
                .author(request.author())
                .icon(request.icon())
                .published(request.published())
                .priceCents(ContentAccessService.validatedPriceCents(request.isFree(), request.priceCents()))
                .isFree(request.isFree())
                .build();
        return toDetail(repository.save(article));
    }

    @Transactional
    public ArticleDetailResponse update(UUID id, ArticleWriteRequest request) {
        Article article = findOrThrow(id);

        if (!article.getSlug().equals(request.slug()) && repository.existsBySlug(request.slug())) {
            throw ApiException.conflict("An article with this slug already exists.");
        }

        article.setSlug(request.slug());
        article.setTitle(request.title());
        article.setExcerpt(request.excerpt());
        article.setContent(request.content());
        article.setContentFormat(normalizeFormat(request.contentFormat(), article.getContentFormat()));
        article.setArticleDate(request.date() != null ? request.date() : article.getArticleDate());
        article.setReadMinutes(request.readMinutes());
        article.setTags(joinTags(request.tags()));
        article.setAuthor(request.author());
        article.setIcon(request.icon());
        article.setPublished(request.published());
        article.setPriceCents(ContentAccessService.validatedPriceCents(request.isFree(), request.priceCents()));
        article.setIsFree(request.isFree());

        return toDetail(repository.save(article));
    }

    @Transactional
    public ArticleDetailResponse setArchived(UUID id, boolean archived) {
        Article article = findOrThrow(id);
        article.setArchived(archived);
        return toDetail(repository.save(article));
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw ApiException.notFound("Article not found.");
        }
        repository.deleteById(id);
    }

    private Article findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("Article not found."));
    }

    private ArticleDetailResponse toDetail(Article a) {
        return toDetail(a, false);
    }

    private String normalizeFormat(String requested, String fallback) {
        if (requested == null || requested.isBlank()) return fallback;
        if (!requested.equals("html") && !requested.equals("markdown")) {
            throw ApiException.badRequest("contentFormat must be 'html' or 'markdown'.");
        }
        return requested;
    }

    private String joinTags(List<String> tags) {
        return tags == null ? "" : String.join(",", tags);
    }

    private List<String> splitTags(String tags) {
        if (tags == null || tags.isBlank()) return List.of();
        return Arrays.stream(tags.split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
    }

    private ArticleSummaryResponse toSummary(Article a) {
        return new ArticleSummaryResponse(
                a.getId(), a.getSlug(), a.getTitle(), a.getExcerpt(), a.getArticleDate(),
                a.getReadMinutes(), splitTags(a.getTags()), a.getAuthor(), a.getIcon(), a.getPublished(), a.getArchived(),
                a.getPriceCents(), a.getIsFree());
    }

    private ArticleDetailResponse toDetail(Article a, boolean locked) {
        return new ArticleDetailResponse(
                a.getId(), a.getSlug(), a.getTitle(), a.getExcerpt(), locked ? "" : a.getContent(), a.getArticleDate(),
                a.getReadMinutes(), splitTags(a.getTags()), a.getAuthor(), a.getIcon(), a.getPublished(),
                a.getArchived(), a.getContentFormat(), a.getPriceCents(), a.getIsFree(), locked);
    }
}
