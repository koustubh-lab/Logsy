package com.spring.blog_application.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
public class PostController {
    @GetMapping
    public String getString() {
        return "Hello World again";
    }

    @GetMapping("/api/posts")
    public void getPosts(Authentication authentication) {
        log.info("Authentication Object: {}", authentication.getName());
    }
}
