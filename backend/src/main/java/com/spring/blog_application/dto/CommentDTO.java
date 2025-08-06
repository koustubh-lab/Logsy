package com.spring.blog_application.dto;

import java.time.OffsetDateTime;

public record CommentDTO(Integer id, String content, OffsetDateTime createAt, String author, boolean isEditable) {
}
