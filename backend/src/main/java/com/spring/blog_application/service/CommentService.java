package com.spring.blog_application.service;

import com.spring.blog_application.dto.CommentDTO;
import com.spring.blog_application.model.Comment;
import com.spring.blog_application.model.Post;
import com.spring.blog_application.model.User;
import com.spring.blog_application.repository.CommentRepository;
import com.spring.blog_application.repository.PostRepository;
import com.spring.blog_application.repository.UserRepository;
import com.spring.blog_application.utils.CreateCommentRequest;
import com.spring.blog_application.utils.DeleteCommentRequest;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class CommentService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public CommentService(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public void createCommentByUser(CreateCommentRequest request, String email) {
        Post post = postRepository.findById(request.postId())
                .orElseThrow(() -> new EntityNotFoundException("Post with id: " + request.postId() + " was not found"));

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new EntityNotFoundException("User with email: " + email + " was not found");
        }

        Comment comment = new Comment(null, request.comment(), OffsetDateTime.now(ZoneOffset.UTC), post, user);
        post.getComments().add(comment);
        commentRepository.save(comment);
    }

    public void deleteCommentByUser(Integer commentId, Integer postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post with id: " + postId + " was not found"));
        if (!post.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized action performed by user");
        }
        post.getComments().removeIf(comment -> comment.getId().equals(commentId));
        commentRepository.deleteById(commentId);
        postRepository.save(post);
    }

    public List<CommentDTO> getCommentsByPostId(Integer postId, String email) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream().map(comment -> new CommentDTO(comment.getId(), comment.getContent(), comment.getCreatedAt(), comment.getCommenter().getUsername(), comment.getCommenter().getEmail().equals(email))).toList();
    }
}
