package com.tarikelberrak.portfolio.security;

import java.time.Instant;
import java.util.UUID;

/** The authenticated principal attached to the SecurityContext for each request. */
public record AuthPrincipal(UUID userId, String email, boolean isAdmin, UUID jti, Instant expiresAt) {
}
