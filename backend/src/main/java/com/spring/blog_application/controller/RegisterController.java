package com.spring.blog_application.controller;

import com.spring.blog_application.service.UserService;
import com.spring.blog_application.utils.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RegisterController {
    private final UserService userService;

    public RegisterController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok().body("User Created Successfully");
    }

    @GetMapping("/authenticate")
    public ResponseEntity<Void> isAuthenticated() {
        return ResponseEntity.ok().build();
    }
}
