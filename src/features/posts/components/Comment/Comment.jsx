import React from "react";
import styles from "./Comment.module.css";

const Comment = ({ avatar, username, content, time }) => {
  return (
    <div className={styles.commentItem}>
      <img src={avatar} alt="avatar" className={styles.avatar} />
      <div className={styles.content}>
        <strong>{username}</strong>
        <p>{content}</p>
        <span className={styles.time}>{new Date(time).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default Comment;