package com.tanvan.blogapplication.model;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Entity
@Table(name = "likes")
@Data
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // Ai thả like

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;  // Like bài viết nào

    private LocalDateTime createdAt = LocalDateTime.now();
}
