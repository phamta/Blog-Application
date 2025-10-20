import React from "react";
import PostCard from "../../../../components/ui/PostCard/PostCard";

function PostList({ posts, onLike, onComment, onShare }) {
  return (
    <>
      {posts.map((p) => (
        <PostCard
          key={p.id}
          postId={p.id}
          avatar={p.userAvatar || "/default-avatar.png"}
          username={p.username || "Ẩn danh"}
          time={new Date(p.createdAt).toLocaleString()}
          content={p.content}
          image={p.imageUrl}
          likeCount={p.likeCount || 0}
          hasLiked={p.hasLiked || false}
          commentCount={p.commentCount || 0}
          onLike={(liked) => onLike(p.id, liked)}
          // onComment={() => onComment(p.id)}
          // onShare={() => onShare(p.id)}
        />
      ))}
    </>
  );
}

export default PostList;