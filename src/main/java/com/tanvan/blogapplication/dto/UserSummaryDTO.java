package com.tanvan.blogapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String imageUrl; // ảnh avatar (base64 hoặc link ảnh)
}
