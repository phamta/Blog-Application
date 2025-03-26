package com.tanvan.blogapplication.repository;

import com.tanvan.blogapplication.model.Post;
import com.tanvan.blogapplication.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Integer> {
    // Lấy danh sách bài viết theo userId
    List<Post> findByAuthor(User author);
}
