package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.ContentType;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.ContentPurchaseRepository;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ContentAccessServiceTest {

    private final ContentPurchaseRepository purchases = mock(ContentPurchaseRepository.class);
    private final ContentAccessService access = new ContentAccessService(purchases);
    private final UUID contentId = UUID.randomUUID();

    private AuthPrincipal principal(boolean admin) {
        return new AuthPrincipal(UUID.randomUUID(), "u@example.com", admin, UUID.randomUUID(), Instant.now().plusSeconds(60));
    }

    @Test
    void freeContentIsNeverLocked() {
        assertThat(access.isLocked(null, ContentType.article, contentId, true, 0)).isFalse();
    }

    @Test
    void paidContentIsLockedForAnonymousReaders() {
        assertThat(access.isLocked(null, ContentType.article, contentId, false, 500)).isTrue();
    }

    @Test
    void paidContentIsLockedForSignedInReadersWhoHaveNotBought() {
        AuthPrincipal user = principal(false);
        when(purchases.existsByUserIdAndContentTypeAndContentId(user.userId(), ContentType.lab, contentId)).thenReturn(false);
        assertThat(access.isLocked(user, ContentType.lab, contentId, false, 500)).isTrue();
    }

    @Test
    void paidContentIsUnlockedForBuyersAndAdmins() {
        AuthPrincipal buyer = principal(false);
        when(purchases.existsByUserIdAndContentTypeAndContentId(buyer.userId(), ContentType.article, contentId)).thenReturn(true);
        assertThat(access.isLocked(buyer, ContentType.article, contentId, false, 500)).isFalse();
        assertThat(access.isLocked(principal(true), ContentType.article, contentId, false, 500)).isFalse();
    }

    @Test
    void freeItemsAreStoredAtZeroAndPaidItemsNeedAtLeastFiftyCents() {
        assertThat(ContentAccessService.validatedPriceCents(true, 1999)).isZero();
        assertThat(ContentAccessService.validatedPriceCents(false, 1999)).isEqualTo(1999);
        assertThatThrownBy(() -> ContentAccessService.validatedPriceCents(false, 0)).isInstanceOf(ApiException.class);
        assertThatThrownBy(() -> ContentAccessService.validatedPriceCents(false, 49)).isInstanceOf(ApiException.class);
    }
}
