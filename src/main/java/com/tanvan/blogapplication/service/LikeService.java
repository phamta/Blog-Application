package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.entity.Like;
import com.tanvan.blogapplication.entity.Post;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.repository.LikeRepository;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    // Tạo like cho bài viết
    public Like likePost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(userId, postId);
        if(existingLike.isPresent()){
            return existingLike.get();
        }

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);
        like.setCreatedAt(LocalDateTime.now());
        return likeRepository.save(like);
    }

    // Xóa like (unlike)
    public void unlikePost(Long userId, Long postId) {
        Optional<Like> likeOpt = likeRepository.findByUserIdAndPostId(userId, postId);
        if(likeOpt.isPresent()){
            likeRepository.delete(likeOpt.get());
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