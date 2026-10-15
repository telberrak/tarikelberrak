package com.tarikelberrak.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Thin mail wrapper. Sends real email when a JavaMailSender is configured
 * (spring.mail.host set); otherwise logs the message so local dev/testing
 * still works without an SMTP server.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;
    private final String fromAddress;
    private final String siteUrl;

    public MailService(
            @Autowired(required = false) JavaMailSender mailSender,
            @Value("${app.mail.from:no-reply@example.com}") String fromAddress,
            @Value("${app.site-url}") String siteUrl) {
        this.mailSender = mailSender;
        this.fromAddress = fromAddress;
        this.siteUrl = siteUrl;
    }

    public void sendPasswordResetEmail(String to, String token) {
        String link = siteUrl + "/reset-password?token=" + token;
        send(to, "Reset your password",
                "Reset your password by visiting: " + link + "\n\nThis link expires in 1 hour.");
    }

    public void sendContactNotification(String notifyAddress, String name, String fromEmail, String message) {
        if (notifyAddress == null || notifyAddress.isBlank()) return;
        send(notifyAddress, "New contact form submission from " + name,
                name + " <" + fromEmail + "> wrote:\n\n" + message);
    }

    public void sendPurchaseReceipt(String to, String courseTitle, String amountLabel) {
        send(to, "You're enrolled: " + courseTitle,
                "Thanks for your purchase (" + amountLabel + "). You now have full access to \""
                        + courseTitle + "\" — jump back in from your account dashboard.");
    }

    public void sendContentReceipt(String to, String title, String amountLabel) {
        send(to, "Purchase confirmed: " + title,
                "Thanks for your purchase (" + amountLabel + "). You now have full access to \""
                        + title + "\" - just sign in and open it.");
    }

    private void send(String to, String subject, String text) {
        if (mailSender == null) {
            log.info("[mail:skipped, no SMTP configured] to={} subject={}\n{}", to, subject, text);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
