package com.spring.blog_application.controller;

import com.spring.blog_application.dto.PostDTO;
import com.spring.blog_application.model.Post;
import com.spring.blog_application.service.PostService;
import com.spring.blog_application.utils.CreatePostRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public String getString() {
        return "Hello World again";
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostDTO>> getPostsByPage(@RequestParam(defaultValue = "0") int page, Authentication authentication) {
        return ResponseEntity.ok(postService.getPostsByPage(page, authentication.getName()).getContent());
    }

    @PostMapping("/create-post")
    public ResponseEntity<Void> createPostForSpecificUser(@RequestBody CreatePostRequest request, Authentication authentication) {
        postService.createPostForUser(request, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable int id, Authentication authentication) {
        return ResponseEntity.ok(postService.getPostById(id, authentication.getName()));
    }

    @DeleteMapping("/post/{id}")
    public ResponseEntity<Void> deletePostById(@PathVariable int id) {
        postService.deletePostById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/post/{id}")
    public ResponseEntity<Void> updatePostById(@PathVariable int id, @RequestBody CreatePostRequest request) {
        log.info("Create post request object: {}", request);
        postService.updatePostById(id, request);
        return ResponseEntity.ok().build();
    }
}
