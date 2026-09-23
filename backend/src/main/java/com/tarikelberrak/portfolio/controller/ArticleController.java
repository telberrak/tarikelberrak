package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.ArticleDtos.*;
import com.tarikelberrak.portfolio.service.ArticleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    private final ArticleService articleService;

    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @GetMapping
    public List<ArticleSummaryResponse> list() {
        return articleService.listPublished();
    }

    @GetMapping("/{slug}")
    public ArticleDetailResponse getBySlug(@PathVariable String slug) {
        return articleService.getPublishedBySlug(slug);
    }
}
