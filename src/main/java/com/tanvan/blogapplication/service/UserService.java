package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.model.Post;
import com.tanvan.blogapplication.model.User;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PostService postService;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.postService = new PostService();
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            List<Post> posts = postService.getPostsByUserId(id);
            user.setPosts(posts); // Gán danh sách bài viết vào user
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public User createUser(User user, MultipartFile image) {
        user.setPassword(user.getPassword());

        // Handle image (if provided)
        if (image != null && !image.isEmpty()) {
            try {
                user.setImageName(image.getOriginalFilename());
                user.setImageType(image.getContentType());
                user.setImageData(image.getBytes());
            } catch (Exception e) {
                throw new RuntimeException("Failed to process image", e);
            }
        }

        // Save the user
        return userRepository.save(user);
    }

    // Cập nhật thông tin người dùng (không thay đổi ảnh)
    public Optional<User> updateUserInfo(Long id, User updatedUser) {
        return userRepository.findById(id).map(existingUser -> {
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setBirthday(updatedUser.getBirthday());
            // Các trường khác nếu cần cập nhật...
            return userRepository.save(existingUser);
        });
    }

    // Cập nhật ảnh của người dùng
    public Optional<User> updateUserImage(Long id, MultipartFile image) {
        return userRepository.findById(id).map(existingUser -> {
            try {
                existingUser.setImageName(image.getOriginalFilename());
                existingUser.setImageType(image.getContentType());
                existingUser.setImageData(image.getBytes());
            } catch (Exception e) {
                throw new RuntimeException("Failed to process image", e);
            }
            return userRepository.save(existingUser);
        });
    }

    public boolean deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }
        return false;
    }
}