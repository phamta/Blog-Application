import React from "react";
import "../css/Post.css";

const Post = ({
  post,
  handleLike, // <== thêm dòng này để nhận từ props
  toggleComments,
  commentToggle,
  postComments,
  newComments,
  handleCommentChange,
  handleCommentSubmit,
}) => {
  return (
    <div key={post.id} className="post-card">
      <p className="post-date">
        Đăng vào: {new Date(post.createdAt).toLocaleString()}
      </p>
      <h4 className="post-title">{post.title}</h4>
      {post.imageData && post.imageType && (
        <img
          src={`data:${post.imageType};base64,${post.imageData}`}
          alt={post.title}
          className="post-image"
        />
      )}
      <div className="interaction-container">
        <span
          className="interaction-item"
          style={{ cursor: "pointer", color: post.isLike ? "red" : "gray" }}
          onClick={() => handleLike(post.id, post.isLike)} // ✅ sửa ở đây
        >
          {post.isLike ? "❤️" : "🤍"} {post.likeCount}
        </span>
        <span
          className="interaction-item"
          style={{ cursor: "pointer" }}
          onClick={() => toggleComments(post.id)}
        >
          💬 {postComments[post.id]?.length || 0}
        </span>
      </div>

      {commentToggle[post.id] && (
        <div className="comment-container">
          {postComments[post.id]?.length > 0 ? (
            postComments[post.id].map((comment) => (
              <div key={comment.id} className="comment-card">
                {comment.user &&
                comment.user.imageData &&
                comment.user.imageType ? (
                  <img
                    src={`data:${comment.user.imageType};base64,${comment.user.imageData}`}
                    alt={comment.user.username}
                    className="comment-profile-image"
                  />
                ) : (
                  <div className="comment-placeholder">No Image</div>
                )}
                <div className="comment-content">
                  <strong>
                    {comment.user
                      ? comment.user.username
                      : "Người dùng ẩn danh"}
                  </strong>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Không có bình luận nào.</p>
          )}
          <div className="comment-input-container">
            <input
              type="text"
              placeholder="Nhập bình luận..."
              value={newComments[post.id] || ""}
              onChange={(e) => handleCommentChange(post.id, e.target.value)}
              className="comment-input"
            />
            <button
              onClick={() => handleCommentSubmit(post.id)}
              className="comment-button"
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
