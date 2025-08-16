package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.dto.NotificationRequest;
import com.tanvan.blogapplication.entity.*;
import com.tanvan.blogapplication.mapper.NotificationMapper;
import com.tanvan.blogapplication.repository.LikeRepository;
import com.tanvan.blogapplication.repository.NotificationRepository;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    // Tạo like cho bài viết
    public Like likePost(Long userId, Long postId) {
        User actor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(userId, postId);
        if(existingLike.isPresent()){
            return existingLike.get();
        }

        // 1. Lưu like
        Like like = new Like();
        like.setUser(actor);
        like.setPost(post);
        like.setCreatedAt(LocalDateTime.now());
        Like savedLike = likeRepository.save(like);

        // Cập nhật likeCount trong post
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);

        User recipient = post.getAuthor();
        if (!(recipient.getId() == actor.getId())) {
            NotificationRequest notifReq = new NotificationRequest();
            notifReq.setType(NotificationType.LIKE);
            notifReq.setRecipientId(recipient.getId());
            notifReq.setActorId(actor.getId());
            notifReq.setPostId(post.getId());

            Notification notification = NotificationMapper.toEntity(
                    notifReq, recipient, actor, post
            );

            Notification savedNotification = notificationRepository.save(notification);

            NotificationRequest notifDTO = NotificationMapper.toDTO(savedNotification);

            // 4. Gửi socket cho chủ bài viết
            messagingTemplate.convertAndSend(
                    "/topic/notifications/" + recipient.getId(),
                    notifDTO
            );
        }

        return savedLike;
    }

    public void unlikePost(Long userId, Long postId) {
        Optional<Like> likeOpt = likeRepository.findByUserIdAndPostId(userId, postId);
        if(likeOpt.isPresent()){
            Like like = likeOpt.get();
            Post post = like.getPost();

            likeRepository.delete(like);

            // Cập nhật likeCount sau khi unlike
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
            postRepository.save(post);
        } else {
            throw new RuntimeException("Like not found");
        }
    }

    // Lấy danh sách like cho một bài post
    public List<Like> getLikesByPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return likeRepository.findByPost(post);
    }
}