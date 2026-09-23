package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.PasswordResetToken;
import com.tarikelberrak.portfolio.domain.User;
import com.tarikelberrak.portfolio.dto.AuthDtos.*;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.PasswordResetTokenRepository;
import com.tarikelberrak.portfolio.repository.UserRepository;
import com.tarikelberrak.portfolio.security.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;
    private final String adminEmail;

    public AuthService(
            UserRepository userRepository,
            PasswordResetTokenRepository resetTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            MailService mailService,
            @Value("${app.admin-email:}") String adminEmail) {
        this.userRepository = userRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.adminEmail = adminEmail;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw ApiException.conflict("An account with this email already exists.");
        }

        User user = User.builder()
                .email(request.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.password()))
                .displayName(request.displayName())
                .build();
        user = userRepository.save(user);
        user = maybePromoteToAdmin(user);

        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password.");
        }

        user = maybePromoteToAdmin(user);
        return buildAuthResponse(user);
    }

    /**
     * Bootstraps the site owner as admin: if ADMIN_EMAIL is set and matches
     * this user, they become an admin on their next signup/login. No admin
     * UI is needed to create the first admin account.
     */
    private User maybePromoteToAdmin(User user) {
        if (!adminEmail.isBlank() && adminEmail.equalsIgnoreCase(user.getEmail()) && !user.getIsAdmin()) {
            user.setIsAdmin(true);
            user = userRepository.save(user);
        }
        return user;
    }

    @Transactional(readOnly = true)
    public UserResponse me(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found."));
        return toUserResponse(user);
    }

    @Transactional
    public void forgotPassword(String email) {
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .user(user)
                    .token(token)
                    .expiresAt(Instant.now().plusSeconds(3600))
                    .build();
            resetTokenRepository.save(resetToken);
            mailService.sendPasswordResetEmail(user.getEmail(), token);
        });
        // Always behaves the same whether or not the email exists, to avoid leaking
        // which addresses have accounts.
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = resetTokenRepository.findByToken(token)
                .orElseThrow(() -> ApiException.badRequest("This reset link is invalid or has expired."));

        if (resetToken.getUsed() || resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw ApiException.badRequest("This reset link is invalid or has expired.");
        }

        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        resetTokenRepository.save(resetToken);
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getIsAdmin());
        return new AuthResponse(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getStripeCustomerId() != null,
                user.getIsAdmin());
    }
}
