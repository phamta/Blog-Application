import React from "react";
import PostCard from "../../../../components/ui/PostCard/PostCard";
import styles from "./PostList.module.css";

function PostList({ posts, onLike, onComment, onShare }) {
  return (
    <div className={styles.grid}>
      {posts.map((p) => (
        <PostCard
          key={p.id}
          postId={p.id}
          avatar={p.author.imageUrl || "/default-avatar.png"}
          username={p.author.username || "Ẩn danh"}
          time={new Date(p.createdAt).toLocaleString()}
          title={p.title}
          image={p.imageUrl}
          likeCount={p.likeCount || 0}
          hasLiked={p.hasLiked || false}
          commentCount={p.commentCount || 0}
          onLike={(liked) => onLike(p.id, liked)}
          // onComment={() => onComment(p.id)}
          // onShare={() => onShare(p.id)}
        />
      ))}
    </div>
  );
}

export default PostList;