package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.LabDtos.*;
import com.tarikelberrak.portfolio.service.LabService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/labs")
public class AdminLabController {

    private final LabService labService;

    public AdminLabController(LabService labService) {
        this.labService = labService;
    }

    @GetMapping
    public List<LabSummaryResponse> list() {
        return labService.adminList();
    }

    @GetMapping("/{id}")
    public LabDetailResponse get(@PathVariable UUID id) {
        return labService.adminGet(id);
    }

    @PostMapping
    public LabDetailResponse create(@Valid @RequestBody LabWriteRequest request) {
        return labService.create(request);
    }

    @PutMapping("/{id}")
    public LabDetailResponse update(@PathVariable UUID id, @Valid @RequestBody LabWriteRequest request) {
        return labService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        labService.delete(id);
    }
}
