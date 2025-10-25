package com.tanvan.blogapplication.service;

import com.tanvan.blogapplication.dto.PostCardDTO;
import com.tanvan.blogapplication.dto.UserSummaryDTO;
import com.tanvan.blogapplication.entity.Post;
import com.tanvan.blogapplication.entity.User;
import com.tanvan.blogapplication.repository.LikeRepository;
import com.tanvan.blogapplication.repository.PostRepository;
import com.tanvan.blogapplication.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {


    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository, LikeRepository likeRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
    }

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

    public Post getPost(Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        return postOptional.get();
    }

    public List<Post> getPostsByUserId(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        System.out.println("User " + userId );
        return postRepository.findByAuthor(userOptional.get());
    }

    public List<PostCardDTO> getAllPostsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(pageable);

        return postPage.getContent().stream()
                .map(this::convertToPostCardDTO)
                .collect(Collectors.toList());
    }

    // Lấy post dưới dạng PostCardDTO theo id
    public PostCardDTO getPostById(Long postId) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isEmpty()) {
            throw new RuntimeException("Post not found");
        }

        Post post = postOptional.get();
        return convertToPostCardDTO(post);
    }

    private PostCardDTO convertToPostCardDTO(Post post) {
        User author = post.getAuthor();
        UserSummaryDTO authorDTO = new UserSummaryDTO(
                author.getId(),
                author.getUsername(),
                author.getImageType() != null && author.getImageData() != null
                        ? "data:" + author.getImageType() + ";base64," +
                        java.util.Base64.getEncoder().encodeToString(author.getImageData())
                        : null
        );

        boolean hasLiked = likeRepository.existsByUserIdAndPostId(author.getId(), post.getId());

        System.out.println("Value of hasLiked: " + hasLiked + " postId: " + post.getId());

        return new PostCardDTO(
                post.getId(),
                post.getTitle(),
                post.getImageType() != null && post.getImageData() != null
                        ? "data:" + post.getImageType() + ";base64," +
                        java.util.Base64.getEncoder().encodeToString(post.getImageData())
                        : null,
                post.getCreatedAt(),
                post.getLikeCount(),
                hasLiked,
                post.getCommentCount(),
                authorDTO
        );
    }
}
