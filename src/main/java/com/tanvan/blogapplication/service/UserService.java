package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.entity.Post;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final PostService postService;

    public UserService(UserRepository userRepository, PostService postService) {
        this.userRepository = userRepository;
        this.postService = postService;
    }

    public Optional<User> login(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }


    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
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

    public boolean updateAvatar(Long userId, MultipartFile image) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();
        try {
            byte[] imageData = image.getBytes();
            String imageType = image.getContentType(); // ví dụ: "image/jpeg"

            user.setImageData(imageData);
            user.setImageType(imageType);
            userRepository.save(user);
            return true;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read image data", e);
        }
    }


}