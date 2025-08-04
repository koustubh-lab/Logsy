package com.spring.blog_application.service;

import com.spring.blog_application.model.JwtToken;
import com.spring.blog_application.repository.JwtTokenRepository;
import org.springframework.stereotype.Service;

@Service
public class JwtTokenService {
    private final JwtTokenRepository jwtTokenRepository;

    public JwtTokenService(JwtTokenRepository jwtTokenRepository) {
        this.jwtTokenRepository = jwtTokenRepository;
    }

    public void saveToken(JwtToken token) {
        jwtTokenRepository.save(token);
    }

    public void markTokenAsUsed(String token) {
        JwtToken jwtToken = jwtTokenRepository.findByToken(token);
        if (jwtToken != null) {
            jwtToken.setUsed(true);
            jwtTokenRepository.save(jwtToken);
        }
    }

    public boolean isTokenUsed(String token) {
        JwtToken jwtToken = jwtTokenRepository.findByToken(token);
        return jwtToken != null && jwtToken.isUsed();
    }
}
