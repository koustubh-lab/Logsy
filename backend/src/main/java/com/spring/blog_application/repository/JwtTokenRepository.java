package com.spring.blog_application.repository;

import com.spring.blog_application.model.JwtToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Integer> {
    JwtToken findByToken(String token);
}
