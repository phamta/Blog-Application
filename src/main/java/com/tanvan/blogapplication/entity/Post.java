package com.tanvan.blogapplication.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonBackReference
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

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Like> likes;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Comment> comments;

    @Transient
    private int likeCount;

    @Transient
    private boolean isLike;

    // Getter của likeCount có thể tính dựa trên số lượng like được load
    public int getLikeCount() {
        return (likes != null) ? likes.size() : 0;
    }
}

