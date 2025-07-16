package com.spring.blog_application.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class TokenService {
    private final NimbusJwtDecoder nimbusJwtDecoder;

    @Autowired
    public TokenService(NimbusJwtDecoder nimbusJwtDecoder) {
        this.nimbusJwtDecoder = nimbusJwtDecoder;
    }

    public String validateToken(String token, String expectedPurpose) {
        try {
            Jwt jwt = nimbusJwtDecoder.decode(token);

            // 1. Check expiration
            Instant expiresAt = jwt.getExpiresAt();
            if (expiresAt != null && Instant.now().isAfter(expiresAt)) {
                throw new JwtException("Token has expired");
            }

            // 2. Check purpose
            String purpose = jwt.getClaim("purpose");
            if (!expectedPurpose.equals(purpose)) {
                throw new JwtException("Invalid token purpose");
            }

            // 3. Return email (subject) if valid
            return jwt.getSubject(); // typically the email
        } catch (JwtException e) {
            throw new RuntimeException("Invalid or expired token: " + e.getMessage());
        }
    }
}
