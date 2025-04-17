package com.tanvan.blogapplication.controller;

import com.tanvan.blogapplication.entity.Like;
import com.tanvan.blogapplication.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeService likeService;

    @PostMapping("/like")
    public ResponseEntity<?> likePost(@RequestParam Long userId, @RequestParam Long postId) {
        try {
            Like like = likeService.likePost(userId, postId);
            return ResponseEntity.ok(like);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error liking post: " + e.getMessage());
        }
    }

    @DeleteMapping("/unlike")
    public ResponseEntity<?> unlikePost(@RequestParam Long userId, @RequestParam Long postId) {
        try {
            likeService.unlikePost(userId, postId);
            return ResponseEntity.ok("Unlike successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error unliking post: " + e.getMessage());
        }
    }

    // Endpoint GET để lấy danh sách Like của một bài post
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getLikesByPost(@PathVariable Long postId) {
        try {
            List<Like> likes = likeService.getLikesByPost(postId);
            return ResponseEntity.ok(likes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving likes: " + e.getMessage());
        }
    }
}