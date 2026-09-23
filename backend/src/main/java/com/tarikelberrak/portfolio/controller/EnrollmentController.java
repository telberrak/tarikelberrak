package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.EnrollmentDtos.*;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.service.EnrollmentService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/free")
    public void enrollFree(
            @Valid @RequestBody EnrollFreeRequest request,
            @AuthenticationPrincipal AuthPrincipal principal) {
        enrollmentService.enrollFree(principal.userId(), request.courseSlug());
    }

    @GetMapping("/me")
    public List<EnrolledCourseResponse> myEnrollments(@AuthenticationPrincipal AuthPrincipal principal) {
        return enrollmentService.listMyEnrollments(principal.userId());
    }

    @GetMapping("/me/{courseSlug}")
    public EnrollmentStatusResponse status(
            @PathVariable String courseSlug,
            @AuthenticationPrincipal AuthPrincipal principal) {
        return enrollmentService.getStatus(principal.userId(), courseSlug);
    }
}
