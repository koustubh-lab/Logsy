package com.spring.blog_application.service;

import com.spring.blog_application.model.Post;
import com.spring.blog_application.model.Profile;
import com.spring.blog_application.model.User;
import com.spring.blog_application.repository.UserRepository;
import com.spring.blog_application.utils.RegisterRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;

@Slf4j
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(RegisterRequest request) {
        try {
            User user = new User(
                    null,
                    request.username(),
                    passwordEncoder.encode(request.password()),
                    request.email(),
                    LocalDate.now(),
                    new ArrayList<Post>(),
                    new Profile());
            userRepository.save(user);
        } catch (Exception e) {
            log.info("Error: {}", e.getMessage());
        }
    }
}
