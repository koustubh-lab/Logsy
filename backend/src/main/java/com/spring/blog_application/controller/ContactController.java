package com.spring.blog_application.controller;

import com.spring.blog_application.dto.ContactDTO;
import com.spring.blog_application.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact-admin")
    public ResponseEntity<String> contactAdmin(@RequestBody @Valid ContactDTO contactDTO) {
        contactService.contactAdmin(contactDTO);
        return ResponseEntity.ok("Message sent successfully.");
    }
}
