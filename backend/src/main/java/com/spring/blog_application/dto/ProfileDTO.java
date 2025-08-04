package com.spring.blog_application.dto;

import java.time.LocalDate;
import java.util.Base64;
import java.util.List;

public record ProfileDTO(
        Integer userId,
        String username,
        String email,
        List<String> professions,
        String bio,
        String location,
        String profilePicture,
        String github,
        String linkedin,
        String twitter,
        LocalDate date
) {
}
