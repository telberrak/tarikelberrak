package com.tarikelberrak.portfolio.security;

import io.jsonwebtoken.ExpiredJwtException;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtServiceTest {

    private final JwtService jwtService =
            new JwtService("test-secret-test-secret-test-secret-32ch", 3600);

    @Test
    void generatesATokenThatParsesBackToTheSameClaims() {
        UUID userId = UUID.randomUUID();
        String token = jwtService.generateToken(userId, "alice@example.com", false);

        AuthPrincipal principal = jwtService.parse(token);

        assertThat(principal.userId()).isEqualTo(userId);
        assertThat(principal.email()).isEqualTo("alice@example.com");
        assertThat(principal.isAdmin()).isFalse();
        assertThat(principal.jti()).isNotNull();
    }

    @Test
    void carriesTheAdminClaimThrough() {
        String token = jwtService.generateToken(UUID.randomUUID(), "admin@example.com", true);
        assertThat(jwtService.parse(token).isAdmin()).isTrue();
    }

    @Test
    void eachTokenGetsAUniqueJti() {
        UUID userId = UUID.randomUUID();
        String first = jwtService.generateToken(userId, "alice@example.com", false);
        String second = jwtService.generateToken(userId, "alice@example.com", false);

        assertThat(jwtService.parse(first).jti()).isNotEqualTo(jwtService.parse(second).jti());
    }

    @Test
    void rejectsAnExpiredToken() {
        JwtService shortLived = new JwtService("test-secret-test-secret-test-secret-32ch", -1);
        String token = shortLived.generateToken(UUID.randomUUID(), "alice@example.com", false);

        assertThatThrownBy(() -> shortLived.parse(token)).isInstanceOf(ExpiredJwtException.class);
    }
}
