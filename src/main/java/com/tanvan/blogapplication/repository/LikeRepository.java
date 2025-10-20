package com.tanvan.blogapplication.repository;

import com.tanvan.blogapplication.entity.Like;
import com.tanvan.blogapplication.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndPostId(Long userId, Long postId);
    List<Like> findByPost(Post post);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
}
