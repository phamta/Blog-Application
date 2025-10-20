    package com.tanvan.blogapplication.controller;

    import com.tanvan.blogapplication.dto.PostCardDTO;
    import com.tanvan.blogapplication.entity.Post;
    import com.tanvan.blogapplication.service.PostService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.IOException;
    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("api/posts")
    @CrossOrigin
    public class PostController {

        private final PostService postService;

        public PostController(PostService postService) {
            this.postService = postService;
        }

        // API tạo bài viết có ảnh
        @PostMapping("/upload")
        public ResponseEntity<?> createPostWithImage(
                @RequestParam("userId") Long userId,
                @RequestParam("title") String title,
                @RequestParam(value = "image", required = false) MultipartFile imageFile) {
            try {
                Post post = postService.createPostWithImage(userId, title, imageFile);
                return ResponseEntity.ok(Map.of("message", "Bài đăng đã được tạo", "postId", post.getId()));
            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Lỗi khi tải ảnh lên"));
            } catch (RuntimeException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
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
            System.out.println("So luong bai viet " + posts.size());
            return ResponseEntity.ok(posts);
        }

        // ✅ Lấy danh sách bài viết có phân trang (infinite scroll)
        @GetMapping("/paginated")
        public ResponseEntity<List<PostCardDTO>> getAllPostsPaginated(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "5") int size) {
            List<PostCardDTO> posts = postService.getAllPostsPaginated(page, size);
            return ResponseEntity.ok(posts);
        }
    }
