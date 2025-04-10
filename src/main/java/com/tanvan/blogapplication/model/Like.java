package com.tanvan.blogapplication.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import jakarta.persistence.Id;

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
    @JsonIgnore
    private User user;  // Ai thả like

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    @JsonIgnore
    private Post post;  // Like bài viết nào

    private LocalDateTime createdAt = LocalDateTime.now();
}
