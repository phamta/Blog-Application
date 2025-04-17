package com.tanvan.blogapplication.repository;

import com.tanvan.blogapplication.entity.Post;
import com.tanvan.blogapplication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // Lấy danh sách bài viết theo userId
    List<Post> findByAuthor(User author);
}
