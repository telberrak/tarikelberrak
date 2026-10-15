package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.ContentType;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.ContentPurchaseRepository;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import org.springframework.stereotype.Service;

import java.util.UUID;

/** Decides whether a (possibly anonymous) reader may see a priced article or lab in full. */
@Service
public class ContentAccessService {

    /** Stripe's minimum charge for USD. */
    static final int MIN_PRICE_CENTS = 50;

    private final ContentPurchaseRepository purchaseRepository;

    public ContentAccessService(ContentPurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    public boolean isLocked(AuthPrincipal principal, ContentType type, UUID contentId, boolean isFree, int priceCents) {
        if (isFree || priceCents <= 0) return false;
        if (principal == null) return true;
        if (principal.isAdmin()) return false;
        return !purchaseRepository.existsByUserIdAndContentTypeAndContentId(principal.userId(), type, contentId);
    }

    /** Free items are stored with a zero price; paid items must meet Stripe's minimum. Returns the price to store. */
    public static int validatedPriceCents(boolean isFree, int priceCents) {
        if (isFree) return 0;
        if (priceCents < MIN_PRICE_CENTS) {
            throw ApiException.badRequest("Paid items must cost at least $0.50 — tick \"Free\" for no charge.");
        }
        return priceCents;
    }
}
