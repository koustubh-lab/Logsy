package com.spring.blog_application.repository;

import com.spring.blog_application.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {
    List<Comment> findByPostId(Integer id);

    int countByPostId(Integer id);
}
