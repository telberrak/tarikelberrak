package com.tarikelberrak.portfolio.service;

import com.tarikelberrak.portfolio.domain.ContactSubmission;
import com.tarikelberrak.portfolio.dto.ContactDtos.ContactRequest;
import com.tarikelberrak.portfolio.repository.ContactSubmissionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactSubmissionRepository repository;
    private final MailService mailService;
    private final String notifyAddress;

    public ContactService(
            ContactSubmissionRepository repository,
            MailService mailService,
            @Value("${app.mail.contact-notification:}") String notifyAddress) {
        this.repository = repository;
        this.mailService = mailService;
        this.notifyAddress = notifyAddress;
    }

    @Transactional
    public void submit(ContactRequest request) {
        ContactSubmission submission = ContactSubmission.builder()
                .name(request.name())
                .email(request.email())
                .message(request.message())
                .build();
        repository.save(submission);

        mailService.sendContactNotification(notifyAddress, request.name(), request.email(), request.message());
    }
}
