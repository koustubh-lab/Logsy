package com.spring.blog_application.service;

import com.spring.blog_application.model.User;
import com.spring.blog_application.repository.UserRepository;
import com.spring.blog_application.utils.RegisterRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean registerUser(RegisterRequest request) {
        try {
            User user = new User(
                    null,
                    request.username(),
                    passwordEncoder.encode(request.password()),
                    request.email(),
                    LocalDate.now(),
                    null);
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            log.info("Error: {}", e.getMessage());
            return false;
        }
    }
}
