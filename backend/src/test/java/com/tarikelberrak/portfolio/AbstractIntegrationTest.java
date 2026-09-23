package com.tarikelberrak.portfolio;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Boots the full Spring context against a real, throwaway Postgres container
 * (via Testcontainers) rather than H2 — the Flyway migrations use
 * Postgres-specific SQL (gen_random_uuid(), dollar-quoted strings, etc.)
 * that H2 would either reject or silently handle differently.
 *
 * Each test method runs in its own transaction that's rolled back afterward
 * (Spring Test's standard pattern), so tests don't need manual cleanup and
 * don't leak state into each other.
 */
@SpringBootTest
@ActiveProfiles("test")
@Testcontainers
@Transactional
public abstract class AbstractIntegrationTest {

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine");
}
