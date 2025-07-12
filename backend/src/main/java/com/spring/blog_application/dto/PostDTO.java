package com.spring.blog_application.dto;

import java.time.LocalDateTime;
import java.util.List;

public record PostDTO(
        Integer id,
        String title,
        String content,
        LocalDateTime createdAt,
        String author,
        List<CommentDTO> commentList,
        boolean isLiked
) {}
