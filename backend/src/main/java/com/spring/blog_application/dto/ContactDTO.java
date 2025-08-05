package com.spring.blog_application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record ContactDTO(
        @Size(min = 3, message = "Name must be at least 3 characters long") String name,
        @Email String email,
        @Size(min = 5, message = "Subject must be at least 5 characters long") String subject,
        @Size(min = 5, message = "Message must be at least 5 characters long") String message) {
}
