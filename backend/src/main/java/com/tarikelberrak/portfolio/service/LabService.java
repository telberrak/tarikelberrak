package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.Lab;
import com.tarikelberrak.portfolio.domain.ContentType;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.dto.LabDtos.*;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.LabRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class LabService {

    private final LabRepository repository;

    private final ContentAccessService access;

    public LabService(LabRepository repository, ContentAccessService access) {
        this.repository = repository;
        this.access = access;
    }

    @Transactional(readOnly = true)
    public List<LabSummaryResponse> listPublished() {
        return repository.findByPublishedTrueAndArchivedFalseOrderByLabDateDesc().stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public LabDetailResponse getPublishedBySlug(String slug, AuthPrincipal principal) {
        Lab lab = repository.findBySlugAndPublishedTrueAndArchivedFalse(slug)
                .orElseThrow(() -> ApiException.notFound("Lab not found."));
        boolean locked = access.isLocked(
                principal, ContentType.lab, lab.getId(), lab.getIsFree(), lab.getPriceCents());
        return toDetail(lab, locked);
    }

    @Transactional(readOnly = true)
    public List<LabSummaryResponse> adminList() {
        return repository.findAllByOrderByLabDateDesc().stream().map(this::toSummary).toList();
    }

    @Transactional(readOnly = true)
    public LabDetailResponse adminGet(UUID id) {
        return toDetail(findOrThrow(id));
    }

    @Transactional
    public LabDetailResponse create(LabWriteRequest request) {
        if (repository.existsBySlug(request.slug())) {
            throw ApiException.conflict("A lab with this slug already exists.");
        }
        Lab lab = Lab.builder()
                .slug(request.slug())
                .title(request.title())
                .excerpt(request.excerpt())
                .content(request.content())
                .contentFormat(normalizeFormat(request.contentFormat(), "html"))
                .status(request.status())
                .category(request.category())
                .tags(joinTags(request.tags()))
                .icon(request.icon())
                .labDate(request.date() != null ? request.date() : LocalDate.now())
                .published(request.published())
                .priceCents(ContentAccessService.validatedPriceCents(request.isFree(), request.priceCents()))
                .isFree(request.isFree())
                .build();
        return toDetail(repository.save(lab));
    }

    @Transactional
    public LabDetailResponse update(UUID id, LabWriteRequest request) {
        Lab lab = findOrThrow(id);

        if (!lab.getSlug().equals(request.slug()) && repository.existsBySlug(request.slug())) {
            throw ApiException.conflict("A lab with this slug already exists.");
        }

        lab.setSlug(request.slug());
        lab.setTitle(request.title());
        lab.setExcerpt(request.excerpt());
        lab.setContent(request.content());
        lab.setContentFormat(normalizeFormat(request.contentFormat(), lab.getContentFormat()));
        lab.setStatus(request.status());
        lab.setCategory(request.category());
        lab.setTags(joinTags(request.tags()));
        lab.setIcon(request.icon());
        lab.setLabDate(request.date() != null ? request.date() : lab.getLabDate());
        lab.setPublished(request.published());
        lab.setPriceCents(ContentAccessService.validatedPriceCents(request.isFree(), request.priceCents()));
        lab.setIsFree(request.isFree());

        return toDetail(repository.save(lab));
    }

    @Transactional
    public LabDetailResponse setArchived(UUID id, boolean archived) {
        Lab lab = findOrThrow(id);
        lab.setArchived(archived);
        return toDetail(repository.save(lab));
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw ApiException.notFound("Lab not found.");
        }
        repository.deleteById(id);
    }

    private Lab findOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("Lab not found."));
    }

    private LabDetailResponse toDetail(Lab l) {
        return toDetail(l, false);
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

    private LabSummaryResponse toSummary(Lab l) {
        return new LabSummaryResponse(
                l.getId(), l.getSlug(), l.getTitle(), l.getExcerpt(), l.getStatus(), l.getCategory(),
                splitTags(l.getTags()), l.getIcon(), l.getLabDate(), l.getPublished(), l.getArchived(),
                l.getPriceCents(), l.getIsFree());
    }

    private LabDetailResponse toDetail(Lab l, boolean locked) {
        return new LabDetailResponse(
                l.getId(), l.getSlug(), l.getTitle(), l.getExcerpt(), locked ? "" : l.getContent(), l.getStatus(), l.getCategory(),
                splitTags(l.getTags()), l.getIcon(), l.getLabDate(), l.getPublished(),
                l.getArchived(), l.getContentFormat(), l.getPriceCents(), l.getIsFree(), locked);
    }
}
