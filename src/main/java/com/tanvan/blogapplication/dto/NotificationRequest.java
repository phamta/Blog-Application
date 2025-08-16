package com.tanvan.blogapplication.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.tanvan.blogapplication.entity.NotificationType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationRequest {
    private Long id;
    private NotificationType type; // COMMENT hoặc LIKE
    private String message;
    private Long recipientId;
    private Long actorId;
    private Long postId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
