package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.dto.NotificationRequest;
import com.tanvan.blogapplication.entity.Notification;
import com.tanvan.blogapplication.entity.NotificationType;
import com.tanvan.blogapplication.entity.Post;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.mapper.NotificationMapper;
import com.tanvan.blogapplication.repository.NotificationRepository;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Tạo notification từ DTO (chứa recipientId, actorId, postId).
     * - Lấy entity tương ứng từ repository.
     * - Lưu notification.
     * - Gửi notification qua WebSocket.
     */
    @Transactional
    public NotificationRequest createNotification(NotificationRequest dto) {
        // 1. Lấy recipient và actor
        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found: " + dto.getRecipientId()));

        User actor = userRepository.findById(dto.getActorId())
                .orElseThrow(() -> new EntityNotFoundException("Actor not found: " + dto.getActorId()));

        // 2. Lấy post (nếu có)
        Post post = null;
        if (dto.getPostId() != null) {
            post = postRepository.findById(dto.getPostId())
                    .orElseThrow(() -> new EntityNotFoundException("Post not found: " + dto.getPostId()));
        }

        // 3. Map thủ công DTO -> Entity
        Notification notification =  NotificationMapper.toEntity(dto, recipient, actor, post);

        // 5. Lưu vào DB
        Notification saved = notificationRepository.save(notification);

        // 6. Map Entity -> DTO trả về
        NotificationRequest savedDTO = NotificationMapper.toDTO(notification);

        // 7. Gửi qua websocket. (Tùy bạn: gửi đến tất cả hoặc gửi topic riêng cho recipient)
        // gửi cho tất cả:
        messagingTemplate.convertAndSend("/topic/notifications", savedDTO);

        // --- hoặc gửi cho topic riêng của user (khuyên dùng):
        // messagingTemplate.convertAndSend("/topic/notifications/" + saved.getRecipient().getId(), savedDTO);

        return savedDTO;
    }
}
