package com.tanvan.blogapplication.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageRequest {
    private Long senderId;
    private Long receiverId;
    private String content;
    private LocalDateTime sentAt;
}
