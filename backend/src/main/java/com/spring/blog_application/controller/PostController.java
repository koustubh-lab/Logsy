package com.spring.blog_application.controller;

import com.spring.blog_application.dto.DashboardDataDTO;
import com.spring.blog_application.dto.PostDTO;
import com.spring.blog_application.dto.PostWithProfileDTO;
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

    @GetMapping("/posts")
    public ResponseEntity<List<PostDTO>> getPostsByPageWithoutDashboardDetails(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "3") int size,
                                                        Authentication authentication) {
        return ResponseEntity.ok(postService.getPostsByPageWithoutDashboardDetails(page, size, authentication.getName()).getContent());
    }

    @GetMapping("/global-posts")
    public ResponseEntity<List<PostDTO>> getAllPostsByPageWithoutDashboardDetails(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok(postService.getAllPostsByPageWithoutDashboardDetails(page, size).getContent());
    }

    @GetMapping("/dashboard-posts")
    public ResponseEntity<DashboardDataDTO> getPostsByPageWithDashboardDetails(@RequestParam(defaultValue = "0") int page,@RequestParam(defaultValue = "3") int size, Authentication authentication) {
        return ResponseEntity.ok(postService.getPostsByPageWithDashboardDetails(page, size, authentication.getName()));
    }

    @PostMapping("/create-post")
    public ResponseEntity<Void> createPostForSpecificUser(@RequestBody CreatePostRequest request, Authentication authentication) {
        postService.createPostForUser(request, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<PostWithProfileDTO> getPostById(@PathVariable int id, Authentication authentication) {
        return ResponseEntity.ok(postService.getPostById(id, authentication.getName()));
    }

    @GetMapping("/post/{id}/unauthenticated")
    public ResponseEntity<PostWithProfileDTO> getPostByIdForUnauthenticated(@PathVariable int id) {
        return ResponseEntity.ok(postService.getPostByIdForNotAuthenticatedUser(id));
    }

    @DeleteMapping("/post/{id}")
    public ResponseEntity<Void> deletePostById(@PathVariable int id) {
        postService.deletePostById(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/post/{id}")
    public ResponseEntity<Void> updatePostById(@PathVariable int id, @RequestBody CreatePostRequest request) {
        postService.updatePostById(id, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/posts/search")
    public ResponseEntity<List<PostDTO>> searchPosts(@RequestParam String query) {
        return ResponseEntity.ok(postService.searchPostsByText(query));
    }
}
