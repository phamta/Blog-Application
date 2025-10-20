package com.tanvan.blogapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostCardDTO {
    private Long id;
    private String title;
    private String imageUrl; // ảnh bài viết (base64 hoặc link)
    private LocalDateTime createdAt;
    private int likeCount;
    private boolean hasLiked;
    private int commentCount;

    private UserSummaryDTO author; // Thông tin người đăng bài
}
