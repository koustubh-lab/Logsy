package com.spring.blog_application.controller;

import com.spring.blog_application.service.LikeService;
import com.spring.blog_application.utils.LikeRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class LikeController {
    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/post/like")
    public ResponseEntity<Void> likeAPostByUser(@RequestBody LikeRequest request, Authentication authentication) {
        likeService.likePostByUser(request, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
