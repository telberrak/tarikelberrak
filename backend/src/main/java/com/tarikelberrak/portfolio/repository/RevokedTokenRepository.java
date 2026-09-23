package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.UUID;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, UUID> {

    boolean existsByJti(UUID jti);

    @Modifying
    @Query("delete from RevokedToken t where t.expiresAt < :now")
    int deleteExpiredBefore(Instant now);
}
