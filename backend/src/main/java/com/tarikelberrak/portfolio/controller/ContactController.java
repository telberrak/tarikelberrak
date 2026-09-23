package com.tarikelberrak.portfolio.controller;

import com.tarikelberrak.portfolio.dto.ContactDtos.ContactRequest;
import com.tarikelberrak.portfolio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public void submit(@Valid @RequestBody ContactRequest request) {
        contactService.submit(request);
    }
}
