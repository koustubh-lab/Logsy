package com.spring.blog_application.service;

import com.spring.blog_application.dto.*;
import com.spring.blog_application.model.Like;
import com.spring.blog_application.model.Post;
import com.spring.blog_application.model.Tag;
import com.spring.blog_application.model.User;
import com.spring.blog_application.repository.*;
import com.spring.blog_application.utils.CreatePostRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class PostService {
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final TagRepository tagRepository;
    private final LikeRepository likeRepository;
    private final ProfileService profileservice;

    public PostService(UserRepository userRepository, PostRepository postRepository, CommentRepository commentRepository, TagRepository tagRepository, LikeRepository likeRepository, ProfileService profileservice) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.tagRepository = tagRepository;
        this.likeRepository = likeRepository;
        this.profileservice = profileservice;
    }

    public void createPostForUser(CreatePostRequest request, String email) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            throw new RuntimeException("User was not found");
        }

        List<Tag> tagList = request.tagNames().stream().map(tagName -> {
            Tag existingTag = tagRepository.findByName(tagName);
            if (existingTag != null) {
                return existingTag;
            } else {
                return tagRepository.save(new Tag(null, tagName, new ArrayList<>()));
            }
        }).toList();

        Post postToBeInserted = Post.builder()
                .title(request.title())
                .description(request.description())
                .content(request.content())
                .createdAt(OffsetDateTime.now(ZoneOffset.UTC))
                .user(existingUser)
                .comments(new ArrayList<>())
                .likes(new ArrayList<>())
                .tags(tagList).build();

        existingUser.getPosts().add(postToBeInserted);
        postToBeInserted.setUser(existingUser);
        userRepository.save(existingUser);
    }

    public DashboardDataDTO getPostsByPageWithDashboardDetails(int page, int size, String email) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<Post> postPage = postRepository.findByUserEmail(email, pageable);

        List<Post> allPosts = postRepository.findByUserEmail(email);

        long totalPosts = allPosts.size();
        long totalComments = allPosts.stream().mapToLong(p -> p.getComments().size()).sum();
        long totalLikes = allPosts.stream().mapToLong(p -> p.getLikes().size()).sum();

        List<PostDTO> result = postPage
                .map(post ->
                        new PostDTO(
                                post.getId(),
                                post.getTitle(),
                                post.getDescription(),
                                post.getContent(),
                                post.getCreatedAt(),
                                post.getUser().getUsername(),
                                post.getComments().stream().map(comment ->
                                        new CommentDTO(
                                                comment.getId(),
                                                comment.getContent(),
                                                comment.getCreatedAt(),
                                                comment.getCommenter().getUsername(),
                                                comment.getCommenter().getEmail().equals(email))).toList(),
                                post.getTags().stream()
                                        .map(Tag::getName)
                                        .toList(),
                                false
                        )
                ).getContent();
        return new DashboardDataDTO(result, totalPosts, totalLikes, totalComments);
    }

    public Page<PostDTO> getPostsByPageWithoutDashboardDetails(int page, int size, String email) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<Post> postPage = postRepository.findByUserEmail(email, pageable);

        return postPage
                .map(post ->
                        new PostDTO(
                                post.getId(),
                                post.getTitle(),
                                post.getDescription(),
                                post.getContent(),
                                post.getCreatedAt(),
                                post.getUser().getUsername(),
                                post.getComments().stream().map(comment ->
                                        new CommentDTO(
                                                comment.getId(),
                                                comment.getContent(),
                                                comment.getCreatedAt(),
                                                comment.getCommenter().getUsername(),
                                                comment.getCommenter().getEmail().equals(email))).toList(),
                                post.getTags().stream()
                                        .map(Tag::getName)
                                        .toList(),
                                false
                        )
                );
    }

    public Page<PostDTO> getAllPostsByPageWithoutDashboardDetails(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        Page<Post> postPage = postRepository.findAll(pageable);

        return postPage
                .map(post ->
                        new PostDTO(
                                post.getId(),
                                post.getTitle(),
                                post.getDescription(),
                                post.getContent(),
                                post.getCreatedAt(),
                                post.getUser().getUsername(),
                                new ArrayList<>(),
                                post.getTags().stream()
                                        .map(Tag::getName)
                                        .toList(),
                                false
                        )
                );
    }

    public PostWithProfileDTO getPostById(Integer id, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() ->
                        new EntityNotFoundException("Post with id: " + id + " was not found")
                );

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User with email: " + email + " was not found");
        }

        Like existingLike = likeRepository.findByPostIdAndUserId(id, user.getId());
        boolean isPostLiked = existingLike != null && existingLike.getUser().getId().equals(user.getId());

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

        User author = post.getUser();
        if (author == null) {
            throw new EntityNotFoundException("Author of post with id: " + id + " was not found");
        }

        ProfileDTO profileDTO = profileservice.getProfileByEmail(author.getEmail());
        if (profileDTO == null) {
            throw new EntityNotFoundException("Profile of user with email: " + email + " was not found");
        }

        return new PostWithProfileDTO(
                new PostDTO(
                        post.getId(),
                        post.getTitle(),
                        post.getDescription(),
                        post.getContent(),
                        post.getCreatedAt(),
                        post.getUser().getUsername(),
                        commentDTOList,
                        post.getTags().stream().map(Tag::getName).toList(),
                        isPostLiked),
                profileDTO
                );
    }

    public PostWithProfileDTO getPostByIdForNotAuthenticatedUser(Integer id) {
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
                                        false
                                )
                        ).toList();

        User author = post.getUser();
        if (author == null) {
            throw new EntityNotFoundException("Author of post with id: " + id + " was not found");
        }

        ProfileDTO profileDTO = profileservice.getProfileByEmail(author.getEmail());
        if (profileDTO == null) {
            throw new EntityNotFoundException("Profile of user with email: " + author.getEmail() + " was not found");
        }

        return new PostWithProfileDTO(
                new PostDTO(
                        post.getId(),
                        post.getTitle(),
                        post.getDescription(),
                        post.getContent(),
                        post.getCreatedAt(),
                        post.getUser().getUsername(),
                        commentDTOList,
                        post.getTags().stream().map(Tag::getName).toList(),
                        false),
                profileDTO
                );
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

    public List<PostDTO> searchPostsByText(String query) {
        List<Post> matchedPosts = postRepository.searchPosts(query);

        return matchedPosts.stream().map(post ->
                new PostDTO(
                        post.getId(),
                        post.getTitle(),
                        post.getDescription(),
                        post.getContent(),
                        post.getCreatedAt(),
                        post.getUser().getUsername(),
                        post.getComments().stream().map(comment ->
                                new CommentDTO(
                                        comment.getId(),
                                        comment.getContent(),
                                        comment.getCreatedAt(),
                                        comment.getCommenter().getUsername(),
                                        false
                                )).toList(),
                        post.getTags().stream().map(Tag::getName).toList(),
                        true
                )
        ).toList();
    }
}
