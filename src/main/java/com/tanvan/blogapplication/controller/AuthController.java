package com.tanvan.blogapplication.controller;

import com.tanvan.blogapplication.dto.AuthResponse;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.service.UserService;
import com.tanvan.blogapplication.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest, HttpServletResponse response) {
        Optional<User> user = userService.login(loginRequest.getUsername(), loginRequest.getPassword());
        if (user.isPresent()) {
            String accessToken = jwtUtil.generateAccessToken(user.get().getId());
            String refreshToken = jwtUtil.generateRefreshToken(user.get().getId());

            // Set refresh token vào cookie HTTP Only
            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(false) // dùng true nếu deploy https
                    .path("/")
                    .maxAge(7 * 24 * 60 * 60) // 7 ngày
                    .sameSite("None") // ⚠️ Cho phép cross-site cookie (localhost:3000 -> localhost:8080)
                    .build();
            response.addHeader("Set-Cookie", cookie.toString());
            System.out.printf("Login");
            return ResponseEntity.ok(new AuthResponse(accessToken, null)); // Không trả refreshToken trong body nữa
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Đăng nhập thất bại");
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null || jwtUtil.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = jwtUtil.extractClaims(refreshToken).get("userId", Long.class);
        String newAccessToken = jwtUtil.generateAccessToken(userId);
        System.out.printf("Refresh");
        return ResponseEntity.ok(
                new AuthResponse(newAccessToken, refreshToken)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear cookie chứa refreshToken
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // nếu deploy https thì nên true
                .path("/")
                .maxAge(0) // expire ngay lập tức
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }
}
