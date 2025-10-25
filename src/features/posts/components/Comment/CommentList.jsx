import React from "react";
import Comment from "./Comment";
import styles from "./CommentList.module.css";

const CommentList = ({ comments = [] }) => {
  if (comments.length === 0) {
    return <p className={styles.noComment}>Chưa có bình luận nào 😄</p>;
  }

  return (
    <div className={styles.commentList}>
      {comments.map((comment) => (
        <Comment
          key={comment.id}
          avatar={comment.author?.imageUrl || "/default-avatar.png"}
          username={comment.author?.username || "Người dùng"}
          content={comment.content}
          time={comment.createdAt}
        />
      ))}
    </div>
  );
};

export default CommentList;