package com.tanvan.blogapplication.dto;

import lombok.Data;

// Tạo DTO để nhận dữ liệu từ frontend
@Data
public  class CommentRequest {
    private Long userId;
    private Long postId;
    private String content;

}
