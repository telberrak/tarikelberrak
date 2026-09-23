package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.ArticleDtos.*;
import com.tarikelberrak.portfolio.service.ArticleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/articles")
public class AdminArticleController {

    private final ArticleService articleService;

    public AdminArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<ArticleSummaryResponse> list() {
        return articleService.adminList();
    }

    @GetMapping("/{id}")
    public ArticleDetailResponse get(@PathVariable UUID id) {
        return articleService.adminGet(id);
    }

    @PostMapping
    public ArticleDetailResponse create(@Valid @RequestBody ArticleWriteRequest request) {
        return articleService.create(request);
    }

    @PutMapping("/{id}")
    public ArticleDetailResponse update(@PathVariable UUID id, @Valid @RequestBody ArticleWriteRequest request) {
        return articleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        articleService.delete(id);
    }
}
