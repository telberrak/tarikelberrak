package com.tarikelberrak.portfolio.controller;

import com.stripe.exception.StripeException;
import com.tarikelberrak.portfolio.dto.PaymentDtos.CheckoutSessionResponse;
import com.tarikelberrak.portfolio.security.AuthPrincipal;
import com.tarikelberrak.portfolio.service.PaymentService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/api/courses/{slug}/checkout")
    public CheckoutSessionResponse checkout(
            @PathVariable String slug,
            @AuthenticationPrincipal AuthPrincipal principal) throws StripeException {
        String url = paymentService.createCheckoutSession(principal.userId(), slug);
        return new CheckoutSessionResponse(url);
    }

    @PostMapping("/api/billing/portal")
    public CheckoutSessionResponse billingPortal(@AuthenticationPrincipal AuthPrincipal principal) throws StripeException {
        String url = paymentService.createBillingPortalSession(principal.userId());
        return new CheckoutSessionResponse(url);
    }
}
