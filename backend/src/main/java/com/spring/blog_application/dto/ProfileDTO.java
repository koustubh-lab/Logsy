package com.spring.blog_application.dto;

import com.spring.blog_application.model.Post;

public record ProfileDTO(Post post, String author, boolean isPostLiked) {
}
