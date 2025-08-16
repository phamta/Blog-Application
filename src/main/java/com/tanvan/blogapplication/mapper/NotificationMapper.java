package com.tanvan.blogapplication.mapper;

import com.tanvan.blogapplication.dto.NotificationRequest;
import com.tanvan.blogapplication.entity.*;

import java.time.LocalDateTime;

public class NotificationMapper {

    public static Notification toEntity(NotificationRequest dto, User recipient, User actor, Post post) {
        Notification notification = new Notification();
        notification.setType(dto.getType());

        // Tạo message động dựa trên type
        String actorName = (actor != null) ? actor.getUsername() : "Người dùng";
        String actionMessage = "";

        if (dto.getType() == NotificationType.LIKE) {
            actionMessage = actorName + " đã bày tỏ cảm xúc về bài viết của bạn";
        } else{
            actionMessage = actorName + " đã bình luận về bài viết của bạn";
        }

        notification.setMessage(actionMessage);
        notification.setRecipient(recipient);
        notification.setActor(actor);
        notification.setPost(post);
        notification.setCreatedAt(LocalDateTime.now());
        return notification;
    }

    public static NotificationRequest toDTO(Notification notification) {
        NotificationRequest dto = new NotificationRequest();
        dto.setId(notification.getId());
        dto.setType(notification.getType());
        dto.setCreatedAt(notification.getCreatedAt());

        // Không gửi toàn bộ actor và recipient để tránh lộ dữ liệu
        if (notification.getRecipient() != null) {
            dto.setRecipientId(notification.getRecipient().getId());
        }
        if (notification.getActor() != null) {
            dto.setActorId(notification.getActor().getId());
        }
        if (notification.getPost() != null) {
            dto.setPostId(notification.getPost().getId());
        }

        dto.setMessage(notification.getMessage());
        return dto;
    }
}
