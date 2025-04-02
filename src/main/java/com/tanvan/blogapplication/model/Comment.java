package com.tanvan.blogapplication.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Người bình luận

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post; // Bình luận bài viết nào

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content; // Nội dung bình luận

    private LocalDateTime createdAt = LocalDateTime.now();
}