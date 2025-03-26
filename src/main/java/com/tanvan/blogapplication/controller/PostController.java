package com.tanvan.blogapplication.controller;

import com.tanvan.blogapplication.model.Post;
import com.tanvan.blogapplication.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // API tạo bài viết có ảnh
    @PostMapping("/upload")
    public ResponseEntity<?> createPostWithImage(
            @RequestParam("userId") Long userId,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        try {
            Post post = postService.createPostWithImage(userId, title, content, imageFile);
            return ResponseEntity.ok(post);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading image");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // API lấy ảnh của bài viết
    @GetMapping("/{postId}/image")
    public ResponseEntity<byte[]> getPostImage(@PathVariable Long postId) {
        try {
            byte[] imageData = postService.getPostImage(postId);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "image/jpeg"); // Mặc định JPEG
            return ResponseEntity.ok().headers(headers).body(imageData);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // API lấy danh sách bài viết theo userId
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable Long userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        return ResponseEntity.ok(posts);
    }
}
