import React from "react";
import Post from "./Post";

export default function PostList({
  posts,
  user,
  commentToggle,
  postComments,
  newComments,
  toggleComments,
  handleCommentChange,
  handleCommentSubmit,
  handleLikeToggle,
}) {
  return (
    <div className="postContainer">
      <h3>Bài viết của {user.username}</h3>
      {posts.length === 0 ? (
        <p style={{ textAlign: "center" }}>Không có bài viết nào.</p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            handleLike={handleLikeToggle}
            commentToggle={commentToggle}
            postComments={postComments}
            newComments={newComments}
            toggleComments={toggleComments}
            handleCommentChange={handleCommentChange}
            handleCommentSubmit={handleCommentSubmit}
          />
        ))
      )}
    </div>
  );
}