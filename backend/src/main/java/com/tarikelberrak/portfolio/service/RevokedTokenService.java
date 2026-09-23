package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.RevokedToken;
import com.tarikelberrak.portfolio.repository.RevokedTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class RevokedTokenService {

    private static final Logger log = LoggerFactory.getLogger(RevokedTokenService.class);

    private final RevokedTokenRepository repository;

    public RevokedTokenService(RevokedTokenRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void revoke(UUID jti, Instant tokenExpiresAt) {
        if (repository.existsById(jti)) return;
        repository.save(RevokedToken.builder().jti(jti).expiresAt(tokenExpiresAt).build());
    }

    @Transactional(readOnly = true)
    public boolean isRevoked(UUID jti) {
        return repository.existsByJti(jti);
    }

    /** Rows only matter until the token itself would have expired anyway — keep the table small. */
    @Scheduled(fixedRate = 24, timeUnit = java.util.concurrent.TimeUnit.HOURS)
    @Transactional
    public void pruneExpired() {
        int deleted = repository.deleteExpiredBefore(Instant.now());
        if (deleted > 0) log.info("Pruned {} expired revoked-token rows", deleted);
    }
}
