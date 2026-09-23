package com.tarikelberrak.portfolio.service;

import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.tarikelberrak.portfolio.domain.*;
import com.tarikelberrak.portfolio.exception.ApiException;
import com.tarikelberrak.portfolio.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MailService mailService;

    @Value("${app.site-url}")
    private String siteUrl;

    @Value("${app.stripe.webhook-secret:}")
    private String webhookSecret;

    public PaymentService(
            CourseRepository courseRepository,
            UserRepository userRepository,
            EnrollmentRepository enrollmentRepository,
            MailService mailService) {
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.mailService = mailService;
    }

    @Transactional(readOnly = true)
    public String createCheckoutSession(UUID userId, String courseSlug) throws StripeException {
        User user = userRepository.findById(userId).orElseThrow(() -> ApiException.unauthorized("Sign in first."));
        Course course = courseRepository.findBySlugAndPublishedTrue(courseSlug)
                .orElseThrow(() -> ApiException.notFound("Course not found."));

        if (course.getIsFree() || course.getPriceCents() <= 0) {
            throw ApiException.badRequest("This course is not available for purchase.");
        }

        if (enrollmentRepository.existsByUserIdAndCourseId(userId, course.getId())) {
            return siteUrl + "/learn/" + courseSlug + "/learn";
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setCustomerEmail(user.getEmail())
                .setCustomerCreation(SessionCreateParams.CustomerCreation.ALWAYS)
                .putMetadata("user_id", userId.toString())
                .putMetadata("course_id", course.getId().toString())
                .putMetadata("course_slug", courseSlug)
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setQuantity(1L)
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency("eur")
                                .setUnitAmount((long) course.getPriceCents())
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(course.getTitle())
                                        .setDescription(course.getDescription())
                                        .build())
                                .build())
                        .build())
                .setSuccessUrl(siteUrl + "/learn/" + courseSlug + "?checkout=success")
                .setCancelUrl(siteUrl + "/learn/" + courseSlug + "?checkout=cancelled")
                .build();

        Session session = Session.create(params);
        return session.getUrl();
    }

    @Transactional(readOnly = true)
    public String createBillingPortalSession(UUID userId) throws StripeException {
        User user = userRepository.findById(userId).orElseThrow(() -> ApiException.unauthorized("Sign in first."));

        if (user.getStripeCustomerId() == null) {
            throw ApiException.badRequest("No billing history found for this account yet.");
        }

        com.stripe.param.billingportal.SessionCreateParams params =
                com.stripe.param.billingportal.SessionCreateParams.builder()
                        .setCustomer(user.getStripeCustomerId())
                        .setReturnUrl(siteUrl + "/account")
                        .build();

        com.stripe.model.billingportal.Session portalSession =
                com.stripe.model.billingportal.Session.create(params);
        return portalSession.getUrl();
    }

    @Transactional
    public void handleWebhook(String payload, String signatureHeader) throws SignatureVerificationException {
        Event event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);

        if (!"checkout.session.completed".equals(event.getType())) {
            return;
        }

        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        Session session = (Session) deserializer.getObject().orElse(null);
        if (session == null) return;

        Map<String, String> metadata = session.getMetadata();
        String userIdStr = metadata.get("user_id");
        String courseIdStr = metadata.get("course_id");
        if (userIdStr == null || courseIdStr == null) return;

        UUID userId = UUID.fromString(userIdStr);
        UUID courseId = UUID.fromString(courseIdStr);

        User user = userRepository.findById(userId).orElse(null);
        Course course = courseRepository.findById(courseId).orElse(null);
        if (user == null || course == null) return;

        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseGet(() -> Enrollment.builder().user(user).course(course).build());
        enrollment.setSource(EnrollmentSource.stripe);
        enrollment.setStripePaymentIntentId(session.getPaymentIntent());
        enrollmentRepository.save(enrollment);

        if (session.getCustomer() != null) {
            user.setStripeCustomerId(session.getCustomer());
            userRepository.save(user);
        }

        String email = session.getCustomerDetails() != null ? session.getCustomerDetails().getEmail() : user.getEmail();
        String amountLabel = formatAmount(course.getPriceCents());
        mailService.sendPurchaseReceipt(email, course.getTitle(), amountLabel);
    }

    private String formatAmount(int cents) {
        return "€" + BigDecimal.valueOf(cents, 2).toPlainString();
    }
}
