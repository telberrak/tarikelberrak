package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.AuthDtos.*;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.service.AuthService;
import com.tarikelberrak.portfolio.service.RevokedTokenService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final RevokedTokenService revokedTokenService;

    public AuthController(AuthService authService, RevokedTokenService revokedTokenService) {
        this.authService = authService;
        this.revokedTokenService = revokedTokenService;
    }

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest request) {
        return authService.signup(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(@AuthenticationPrincipal AuthPrincipal principal) {
        return authService.me(principal.userId());
    }

    @PostMapping("/logout")
    public void logout(@AuthenticationPrincipal AuthPrincipal principal) {
        revokedTokenService.revoke(principal.jti(), principal.expiresAt());
    }

    @PostMapping("/forgot-password")
    public void forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.email());
    }

    @PostMapping("/reset-password")
    public void resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.token(), request.password());
    }
}
