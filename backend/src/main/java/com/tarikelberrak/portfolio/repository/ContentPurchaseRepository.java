package com.tarikelberrak.portfolio.repository;

import com.tarikelberrak.portfolio.domain.ContentPurchase;
import com.tarikelberrak.portfolio.domain.ContentType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContentPurchaseRepository extends JpaRepository<ContentPurchase, UUID> {
    boolean existsByUserIdAndContentTypeAndContentId(UUID userId, ContentType contentType, UUID contentId);
}
