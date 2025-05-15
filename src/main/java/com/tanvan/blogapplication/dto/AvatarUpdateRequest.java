package com.tanvan.blogapplication.dto;

import lombok.Data;

@Data
public class AvatarUpdateRequest {
    private String imageBase64;
    private String imageType;

    // getters và setters
}

