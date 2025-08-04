package com.spring.blog_application.service;

import com.spring.blog_application.model.Like;
import com.spring.blog_application.model.Post;
import com.spring.blog_application.model.User;
import com.spring.blog_application.repository.LikeRepository;
import com.spring.blog_application.repository.PostRepository;
import com.spring.blog_application.repository.UserRepository;
import com.spring.blog_application.utils.LikeRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, PostRepository postRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public void likePostByUser(LikeRequest request, String email) {
        Post post = postRepository.findById(request.post())
                .orElseThrow(() -> new EntityNotFoundException("Post with id: " + request.post() + " was not found"));

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("Post with id: " + request.post() + " was not found");
        }

        Like existingLike = likeRepository.findByPostIdAndUserId(request.post(), user.getId());
        if (existingLike != null) {
            throw new IllegalStateException("User has already liked the post");
        }

        Like like = new Like(null, post, user);
        post.getLikes().add(like);

        postRepository.save(post);
    }

    public void unlikePostByUser(LikeRequest request, String email) {
        Post post = postRepository.findById(request.post())
                .orElseThrow(() -> new EntityNotFoundException("Post with id: " + request.post() + " was not found"));

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("Post with id: " + request.post() + " was not found");
        }

        Like existingLike = likeRepository.findByPostIdAndUserId(request.post(), user.getId());
        if (existingLike == null) {
            throw new EntityNotFoundException("User with id: " + user.getId() + " has not yet liked the post with id: " + request.post());
        }

        post.getLikes().removeIf(like -> Objects.equals(like.getId(), existingLike.getId()));
        postRepository.save(post);
    }
}
