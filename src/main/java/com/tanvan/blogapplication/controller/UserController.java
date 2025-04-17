package com.tanvan.blogapplication.controller;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
@JsonIgnoreProperties({"posts"})
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/all")
    public ResponseEntity<List<User>> findAll() {
        return new ResponseEntity<>(userService.findAll(), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        Optional<User> user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Đăng nhập thất bại");
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable long id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }

    @PostMapping("/add")
    public ResponseEntity<User> createUser(@RequestPart User user, @RequestPart MultipartFile image) {
        System.out.println("Add User");
        User userCreated = userService.createUser(user, image);
        return ResponseEntity.ok(userCreated);
    }

    // Cập nhật thông tin người dùng (không thay đổi ảnh)
    @PutMapping("/update/info/{id}")
    public ResponseEntity<User> updateUserInfo(
            @PathVariable Long id,
            @RequestBody User user) {
        Optional<User> updatedUser = userService.updateUserInfo(id, user);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Cập nhật ảnh của người dùng
    @PutMapping("/update/image/{id}")
    public ResponseEntity<User> updateUserImage(
            @PathVariable Long id,
            @RequestPart MultipartFile image) {
        Optional<User> updatedUser = userService.updateUserImage(id, image);
        return updatedUser.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        if (userService.deleteUser(id)) {
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }
}
