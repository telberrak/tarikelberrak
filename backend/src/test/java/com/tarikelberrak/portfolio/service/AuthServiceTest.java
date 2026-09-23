package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.AbstractIntegrationTest;
import com.tarikelberrak.portfolio.domain.PasswordResetToken;
import com.tarikelberrak.portfolio.dto.AuthDtos.*;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.PasswordResetTokenRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestPropertySource;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@TestPropertySource(properties = "app.admin-email=admin@example.com")
class AuthServiceTest extends AbstractIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordResetTokenRepository resetTokenRepository;

    @Test
    void signupThenLoginSucceedsWithTheSamePassword() {
        authService.signup(new SignupRequest("Alice", "alice@example.com", "password123"));

        AuthResponse response = authService.login(new LoginRequest("alice@example.com", "password123"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.user().email()).isEqualTo("alice@example.com");
        assertThat(response.user().isAdmin()).isFalse();
    }

    @Test
    void loginFailsWithTheWrongPassword() {
        authService.signup(new SignupRequest("Alice", "alice@example.com", "password123"));

        assertThatThrownBy(() -> authService.login(new LoginRequest("alice@example.com", "wrong-password")))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("Invalid email or password");
    }

    @Test
    void signupRejectsADuplicateEmail() {
        authService.signup(new SignupRequest("Alice", "dup@example.com", "password123"));

        assertThatThrownBy(() -> authService.signup(new SignupRequest("Alice Two", "dup@example.com", "password123")))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void signupWithTheConfiguredAdminEmailIsAutoPromoted() {
        AuthResponse response = authService.signup(new SignupRequest("Owner", "admin@example.com", "password123"));

        assertThat(response.user().isAdmin()).isTrue();
    }

    @Test
    void forgotPasswordThenResetPasswordAllowsLoginWithTheNewPassword() {
        authService.signup(new SignupRequest("Alice", "reset@example.com", "password123"));

        authService.forgotPassword("reset@example.com");
        PasswordResetToken token = latestTokenFor("reset@example.com");

        authService.resetPassword(token.getToken(), "newpassword456");

        assertThatThrownBy(() -> authService.login(new LoginRequest("reset@example.com", "password123")))
                .isInstanceOf(ApiException.class);
        assertThat(authService.login(new LoginRequest("reset@example.com", "newpassword456")).token()).isNotBlank();
    }

    @Test
    void resetPasswordRejectsAnAlreadyUsedToken() {
        authService.signup(new SignupRequest("Alice", "reuse@example.com", "password123"));
        authService.forgotPassword("reuse@example.com");
        PasswordResetToken token = latestTokenFor("reuse@example.com");

        authService.resetPassword(token.getToken(), "newpassword456");

        assertThatThrownBy(() -> authService.resetPassword(token.getToken(), "anotherpassword789"))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("invalid or has expired");
    }

    @Test
    void resetPasswordRejectsAnExpiredToken() {
        authService.signup(new SignupRequest("Alice", "expired@example.com", "password123"));
        authService.forgotPassword("expired@example.com");
        PasswordResetToken token = latestTokenFor("expired@example.com");
        token.setExpiresAt(Instant.now().minusSeconds(60));
        resetTokenRepository.save(token);

        assertThatThrownBy(() -> authService.resetPassword(token.getToken(), "newpassword456"))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("invalid or has expired");
    }

    private PasswordResetToken latestTokenFor(String email) {
        List<PasswordResetToken> all = resetTokenRepository.findAll();
        return all.stream()
                .filter(t -> t.getUser().getEmail().equalsIgnoreCase(email))
                .max(java.util.Comparator.comparing(PasswordResetToken::getCreatedAt))
                .orElseThrow();
    }
}
