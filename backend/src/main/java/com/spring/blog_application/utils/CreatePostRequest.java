package com.spring.blog_application.utils;

import com.spring.blog_application.model.Tag;

import java.util.List;

public record CreatePostRequest(String title, String content, String description, List<String> tagNames) {
}
