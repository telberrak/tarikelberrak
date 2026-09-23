package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.AbstractIntegrationTest;
import com.tarikelberrak.portfolio.domain.Course;
import com.tarikelberrak.portfolio.domain.CourseLevel;
import com.tarikelberrak.portfolio.domain.User;
import com.tarikelberrak.portfolio.repository.CourseRepository;
import com.tarikelberrak.portfolio.repository.EnrollmentRepository;
import com.tarikelberrak.portfolio.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.TestPropertySource;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Covers webhook idempotency — the one path in this app that touches real
 * money. Stripe retries webhook deliveries on any non-2xx/timeout, so
 * handleWebhook must be safe to call twice for the same event without
 * double-enrolling the user.
 */
@TestPropertySource(properties = "app.stripe.webhook-secret=whsec_test_secret")
class PaymentServiceTest extends AbstractIntegrationTest {

    private static final String WEBHOOK_SECRET = "whsec_test_secret";

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    private Course course;
    private User user;

    @BeforeEach
    void setUp() {
        course = courseRepository.save(Course.builder()
                .slug("webhook-test-course-" + UUID.randomUUID())
                .title("Webhook Test Course")
                .description("A course for testing.")
                .level(CourseLevel.beginner)
                .category("testing")
                .priceCents(4900)
                .isFree(false)
                .published(true)
                .build());

        user = userRepository.save(User.builder()
                .email("buyer-" + UUID.randomUUID() + "@example.com")
                .passwordHash("irrelevant-for-this-test")
                .displayName("Buyer")
                .build());
    }

    @Test
    void handlingTheSameWebhookTwiceEnrollsOnlyOnce() throws Exception {
        String payload = checkoutSessionCompletedPayload(user.getId(), course.getId());
        String signature = sign(payload);

        paymentService.handleWebhook(payload, signature);
        paymentService.handleWebhook(payload, signature);

        assertThat(enrollmentRepository.existsByUserIdAndCourseId(user.getId(), course.getId())).isTrue();
        long count = enrollmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .filter(e -> e.getCourse().getId().equals(course.getId()))
                .count();
        assertThat(count).isEqualTo(1);
    }

    @Test
    void handlingTheWebhookRecordsTheStripeCustomerOnTheUser() throws Exception {
        String payload = checkoutSessionCompletedPayload(user.getId(), course.getId());
        paymentService.handleWebhook(payload, sign(payload));

        User reloaded = userRepository.findById(user.getId()).orElseThrow();
        assertThat(reloaded.getStripeCustomerId()).isEqualTo("cus_test_123");
    }

    private String checkoutSessionCompletedPayload(UUID userId, UUID courseId) {
        long now = Instant.now().getEpochSecond();
        return """
                {
                  "id": "evt_test_123",
                  "object": "event",
                  "api_version": "2024-06-20",
                  "created": %d,
                  "type": "checkout.session.completed",
                  "data": {
                    "object": {
                      "id": "cs_test_123",
                      "object": "checkout.session",
                      "mode": "payment",
                      "payment_intent": "pi_test_123",
                      "customer": "cus_test_123",
                      "customer_details": { "email": "buyer@example.com" },
                      "metadata": { "user_id": "%s", "course_id": "%s" }
                    }
                  }
                }
                """.formatted(now, userId, courseId);
    }

    /** Replicates Stripe's webhook signing scheme (documented at stripe.com/docs/webhooks/signatures). */
    private String sign(String payload) throws Exception {
        long timestamp = Instant.now().getEpochSecond();
        String signedPayload = timestamp + "." + payload;

        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(WEBHOOK_SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(signedPayload.getBytes(StandardCharsets.UTF_8));

        return "t=" + timestamp + ",v1=" + HexFormat.of().formatHex(hash);
    }
}
