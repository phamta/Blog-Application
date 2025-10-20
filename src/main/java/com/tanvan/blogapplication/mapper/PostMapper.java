//package com.tanvan.blogapplication.mapper;
//
//import com.tanvan.blogapplication.dto.PostCardDTO;
//import com.tanvan.blogapplication.dto.UserSummaryDTO;
//import com.tanvan.blogapplication.entity.Post;
//import java.util.Base64;
//
//public class PostMapper {
//
//    public static PostCardDTO toPostCardDTO(Post post) {
//        UserSummaryDTO authorDTO = new UserSummaryDTO(
//                post.getAuthor().getId(),
//                post.getAuthor().getUsername(),
//                post.getAuthor().getImageData() != null
//                        ? "data:" + post.getAuthor().getImageType() + ";base64," +
//                        Base64.getEncoder().encodeToString(post.getAuthor().getImageData())
//                        : null
//        );
//
//        String postImageUrl = post.getImageData() != null
//                ? "data:" + post.getImageType() + ";base64," +
//                Base64.getEncoder().encodeToString(post.getImageData())
//                : null;
//
//        return new PostCardDTO(
//                post.getId(),
//                post.getTitle(),
//                postImageUrl,
//                post.getCreatedAt(),
//                post.getLikeCount(),
//                post.getCommentCount(),
//                authorDTO
//        );
//    }
//}