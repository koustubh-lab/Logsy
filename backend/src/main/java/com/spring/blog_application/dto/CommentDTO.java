package com.spring.blog_application.dto;

import java.time.LocalDateTime;

public record CommentDTO(Integer id, String content, LocalDateTime createAt, String author, boolean isEditable) {
}
