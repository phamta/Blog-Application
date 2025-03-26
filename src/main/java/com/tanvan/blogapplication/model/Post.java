package com.tanvan.blogapplication.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String title;

//    @Column(nullable = false, columnDefinition = "TEXT")
//    private String content;

    // Lưu tên file ảnh
    private String imageName;

    // Lưu định dạng ảnh (PNG, JPG,...)
    private String imageType;

    // Lưu ảnh dưới dạng byte[]
    @Lob
    private byte[] imageData;

    // Thời gian tạo và cập nhật bài viết
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}

