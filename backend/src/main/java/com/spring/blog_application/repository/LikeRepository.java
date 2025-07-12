package com.spring.blog_application.repository;

import com.spring.blog_application.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    Like findByPostIdAndUserId(Integer post_id, Integer user_id);
}
