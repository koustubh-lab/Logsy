package com.spring.blog_application.controller;

import com.spring.blog_application.dto.CommentDTO;
import com.spring.blog_application.service.CommentService;
import com.spring.blog_application.utils.CreateCommentRequest;
import com.spring.blog_application.utils.DeleteCommentRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @DeleteMapping("{postId}/comment/{commentId}")
    public ResponseEntity<Void> deleteCommentByUserOperation(@PathVariable Integer commentId, @PathVariable Integer postId, Authentication authentication) {
        if (commentId == null || postId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        commentService.deleteCommentByUser(commentId, postId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("post/{postId}/comment")
    public ResponseEntity<List<CommentDTO>> getCommentsByPostId(@PathVariable Integer postId, Authentication authentication) {
        commentService.getCommentsByPostId(postId, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
