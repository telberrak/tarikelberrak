package com.tarikelberrak.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class AuthDtos {

    public record SignupRequest(
            @NotBlank @Size(max = 200) String displayName,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 8, max = 200) String password) {
    }

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password) {
    }

    public record ForgotPasswordRequest(@NotBlank @Email String email) {
    }

    public record ResetPasswordRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 8, max = 200) String password) {
    }

    public record UserResponse(
            UUID id,
            String email,
            String displayName,
            String avatarUrl,
            boolean hasBillingHistory,
            boolean isAdmin) {
    }

    public record AuthResponse(String token, UserResponse user) {
    }
}
