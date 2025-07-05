package com.spring.blog_application.controller;

import com.spring.blog_application.service.UserService;
import com.spring.blog_application.utils.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegisterController {
    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/api/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        boolean result = userService.registerUser(request);
        if (!result) {
            return ResponseEntity.status(400).body("Something went wrong");
        }
        return ResponseEntity.ok().body("User Created Successfully");
    }

    @GetMapping("/api/authenticate")
    public ResponseEntity<Void> isAuthenticated() {
        return ResponseEntity.ok().build();
    }
}
