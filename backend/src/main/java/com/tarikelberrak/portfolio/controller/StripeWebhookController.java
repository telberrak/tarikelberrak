package com.tarikelberrak.portfolio.controller;

import com.stripe.exception.SignatureVerificationException;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {

    private final PaymentService paymentService;

    public StripeWebhookController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/stripe")
    public void handleStripeWebhook(HttpServletRequest request) throws IOException {
        String payload = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        String signature = request.getHeader("Stripe-Signature");

        if (signature == null) {
            throw ApiException.badRequest("Missing Stripe-Signature header.");
        }

        try {
            paymentService.handleWebhook(payload, signature);
        } catch (SignatureVerificationException e) {
            throw ApiException.badRequest("Webhook signature verification failed: " + e.getMessage());
        }
    }
}
