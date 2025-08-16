package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.dto.NotificationRequest;
import com.tanvan.blogapplication.entity.*;

import com.tanvan.blogapplication.mapper.NotificationMapper;
import com.tanvan.blogapplication.repository.CommentRepository;
import com.tanvan.blogapplication.repository.NotificationRepository;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository; // Thêm repository này
    private final SimpMessagingTemplate messagingTemplate;

    public Comment addComment(Long userId, Long postId, String content) {
        // 1. Lấy user và post
        User actor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 2. Lưu comment
        Comment comment = new Comment();
        comment.setUser(actor);
        comment.setPost(post);
        comment.setContent(content);
        comment.setCreatedAt(LocalDateTime.now());
        Comment savedComment = commentRepository.save(comment);

        // 3. Tạo notification
        User recipient = post.getAuthor(); // người sở hữu bài viết
        NotificationRequest notifReq = new NotificationRequest();
        notifReq.setType(NotificationType.COMMENT);
        notifReq.setRecipientId(recipient.getId());
        notifReq.setActorId(actor.getId());
        notifReq.setPostId(post.getId());

        Notification notification = NotificationMapper.toEntity(
                notifReq, recipient, actor, post
        );

        // 4. Lưu notification
        Notification savedNotification = notificationRepository.save(notification);

        // 5. Gửi qua socket (dùng DTO để tránh gửi toàn bộ entity)
        NotificationRequest notifDTO = NotificationMapper.toDTO(savedNotification);
        messagingTemplate.convertAndSend(
                "/topic/notifications/" + recipient.getId(),
                notifDTO
        );
        System.out.println("sent notification");

        return savedComment;
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId);
    }
}
