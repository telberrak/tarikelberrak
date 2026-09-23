package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.LabDtos.*;
import com.tarikelberrak.portfolio.service.LabService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
public class LabController {

    private final LabService labService;

    public LabController(LabService labService) {
        this.labService = labService;
    }

    @GetMapping
    public List<LabSummaryResponse> list() {
        return labService.listPublished();
    }

    @GetMapping("/{slug}")
    public LabDetailResponse getBySlug(@PathVariable String slug) {
        return labService.getPublishedBySlug(slug);
    }
}
