package com.spring.blog_application.controller;

import com.spring.blog_application.service.CommentService;
import com.spring.blog_application.utils.CreateCommentRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/comment")
    public ResponseEntity<Void> createCommentByPostId(@RequestBody CreateCommentRequest request, Authentication authentication) {
        log.info("Create comment request: {}", request);
        commentService.createCommentByUser(request, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
