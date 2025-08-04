package com.spring.blog_application.dto;

import java.util.List;

public record DashboardDataDTO(List<PostDTO> posts , Long totalPosts, Long totalLikes, Long totalComments) {
}
