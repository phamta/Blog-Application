package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.model.Post;
import com.tanvan.blogapplication.model.User;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    // Tạo bài viết với ảnh
    public Post createPostWithImage(Long userId, String title, MultipartFile imageFile) throws IOException {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User author = userOptional.get();
        Post post = new Post();
        post.setAuthor(author);
        post.setTitle(title);
//        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());

        // Xử lý ảnh
        if (imageFile != null && !imageFile.isEmpty()) {
            post.setImageName(imageFile.getOriginalFilename());
            post.setImageType(imageFile.getContentType());
            post.setImageData(imageFile.getBytes());
        }

        return postRepository.save(post);
    }

    // Lấy ảnh theo postId
    public byte[] getPostImage(Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty() || postOptional.get().getImageData() == null) {
            throw new RuntimeException("Image not found");
        }
        return postOptional.get().getImageData();
    }

    public List<Post> getPostsByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        System.out.println("User " + userId );
        return postRepository.findByAuthor(userOptional.get());
    }
}
