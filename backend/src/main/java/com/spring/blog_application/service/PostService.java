package com.spring.blog_application.service;

import com.spring.blog_application.dto.CommentDTO;
import com.spring.blog_application.dto.PostDTO;
import com.spring.blog_application.model.Post;
import com.spring.blog_application.model.User;
import com.spring.blog_application.repository.CommentRepository;
import com.spring.blog_application.repository.PostRepository;
import com.spring.blog_application.repository.UserRepository;
import com.spring.blog_application.utils.CreatePostRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public PostService(UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    public void createPostForUser(CreatePostRequest request, String email) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            throw new RuntimeException("User was not found");
        }

        Post postToBeInserted = new Post(
                null,
                request.title(),
                request.content(),
                LocalDateTime.now(),
                existingUser,
                new ArrayList<>(),
                new ArrayList<>()
        );

        existingUser.getPosts().add(postToBeInserted);
        postToBeInserted.setUser(existingUser);
        userRepository.save(existingUser);
    }

    public Page<PostDTO> getPostsByPage(int page, String email) {
        Pageable pageable = PageRequest.of(page, 3, Sort.by("createdAt").ascending());
        Page<Post> postPage = postRepository.findByUserEmail(email, pageable);

        return postPage
            .map(post ->
                new PostDTO(
                    post.getId(),
                    post.getTitle(),
                    post.getContent(),
                    post.getCreatedAt(),
                    post.getUser().getUsername(),
                    post.getComments().stream().map(comment ->
                        new CommentDTO(
                            comment.getId(),
                            comment.getContent(),
                            comment.getCreatedAt(),
                            comment.getCommenter().getUsername(),
                                false)).toList(),
                    true
                )
            );
    }

    public PostDTO getPostById(Integer id, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Post with id: " + id + " was not found")
                );

        List<CommentDTO> commentDTOList =
                commentRepository.findByPostId(post.getId())
                        .stream()
                        .map(comment ->
                                new CommentDTO(
                                        comment.getId(),
                                        comment.getContent(),
                                        comment.getCreatedAt(),
                                        comment.getCommenter().getUsername(),
                                        comment.getCommenter().getEmail().equals(email)
                                )
                        ).toList();

        return new PostDTO(post.getId(), post.getTitle(), post.getContent(), post.getCreatedAt(), post.getUser().getUsername(), commentDTOList, true);
    }

    public void deletePostById(Integer id) {
        postRepository.deleteById(id);
    }

    public void updatePostById(Integer id, CreatePostRequest request) {
        log.info("Update method executed");
        Post post = postRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Post with id: " + id + " was not found"));
        post.setTitle(request.title());
        post.setContent(request.content());
        postRepository.save(post);
    }
}
