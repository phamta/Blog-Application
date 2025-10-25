package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.dto.CommentResponse;
import com.tanvan.blogapplication.dto.NotificationRequest;
import com.tanvan.blogapplication.dto.UserSummaryDTO;
import com.tanvan.blogapplication.entity.*;

import com.tanvan.blogapplication.mapper.NotificationMapper;
import com.tanvan.blogapplication.repository.CommentRepository;
import com.tanvan.blogapplication.repository.NotificationRepository;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository, NotificationRepository notificationRepository, SimpMessagingTemplate messagingTemplate) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.notificationRepository = notificationRepository;
        this.messagingTemplate = messagingTemplate;
    }


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

    public List<CommentResponse> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommentResponse convertToDTO(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        // Convert User to UserSummaryDTO
        User author = comment.getUser();
        UserSummaryDTO authorDTO = new UserSummaryDTO(
                author.getId(),
                author.getUsername(),
                author.getImageType() != null && author.getImageData() != null
                        ? "data:" + author.getImageType() + ";base64," +
                        java.util.Base64.getEncoder().encodeToString(author.getImageData())
                        : null
        );

        dto.setAuthor(authorDTO);

        return dto;
    }
}
