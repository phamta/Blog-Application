package com.tanvan.blogapplication.controller;

import com.tanvan.blogapplication.model.Like;
import com.tanvan.blogapplication.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
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

    // Endpoint xóa like (unlike)
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

}
