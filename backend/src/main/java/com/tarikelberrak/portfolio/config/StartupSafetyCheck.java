package com.tarikelberrak.portfolio.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Refuses to start with known-unsafe dev defaults when a "prod" profile is
 * active — better a crash on boot than a silently insecure deployment.
 */
@Component
public class StartupSafetyCheck {

    private static final String DEFAULT_JWT_SECRET = "dev-only-change-me-dev-only-change-me-32chars";
    private static final String DEFAULT_DB_PASSWORD = "portfolio";

    private final Environment environment;

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${spring.datasource.password}")
    private String dbPassword;

    public StartupSafetyCheck(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void check() {
        boolean isProd = Arrays.asList(environment.getActiveProfiles()).contains("prod");
        if (!isProd) return;

        if (DEFAULT_JWT_SECRET.equals(jwtSecret)) {
            throw new IllegalStateException(
                    "Refusing to start with the default JWT_SECRET under the 'prod' profile. Set a real, random secret.");
        }
        if (DEFAULT_DB_PASSWORD.equals(dbPassword)) {
            throw new IllegalStateException(
                    "Refusing to start with the default DB_PASSWORD under the 'prod' profile. Set a real password.");
        }
    }
}
