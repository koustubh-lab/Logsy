package com.spring.blog_application.controller;

import com.spring.blog_application.service.CommentService;
import com.spring.blog_application.utils.CreateCommentRequest;
import com.spring.blog_application.utils.DeleteCommentRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

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
        commentService.createCommentByUser(request, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/comment")
    public ResponseEntity<Void> deleteCommentByUserOperation(@RequestBody DeleteCommentRequest request, Authentication authentication) {
        commentService.deleteCommentByUser(request, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
