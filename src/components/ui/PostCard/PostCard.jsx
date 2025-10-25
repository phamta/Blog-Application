import React, { useState } from "react";
import styles from "./PostCard.module.css";
import { FaHeart, FaRegHeart, FaComment, FaShare } from "react-icons/fa";
// import {FaHeart} from "lucide-react";

const PostCard = ({
  postId,
  avatar,
  username,
  time,
  title,
  image,
  likeCount,
  hasLiked,
  commentCount,
  onLike,
  onComment,
}) => {
  const [isLiked, setIsLiked] = useState(hasLiked);
  const [likes, setLikes] = useState(likeCount);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikes(prev => prev + (newLiked ? 1 : -1)); // cập nhật đếm like

    // Gửi event lên cha (Home hoặc PostList)
    if (onLike) onLike(postId, newLiked);
  };

  return (
    <div className={styles.postCard}>
      {/* Header */}
      <div className={styles.header}>
        <img src={avatar} alt="User Avatar" className={styles.avatar} />
        <div className={styles.userInfo}>
          <h4 className={styles.username}>{username}</h4>
          <span className={styles.time}>{time}</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.title}>
        <p>{title}</p>
        {image && <img src={image} alt="Post" className={styles.postImage} />}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.actions}>
          <button className={styles.likeButton} onClick={handleLike}>
            {isLiked ? (
              <FaHeart className={styles.likedIcon} />
            ) : (
              <FaRegHeart className={styles.unlikedIcon} />
            )}
            <span className={styles.likeTotal}>{likes}</span>
          </button>

          <button className={styles.commentButton}
          onClick={() => onComment && onComment(postId)}>
            <FaComment className={styles.commentIcon} />
            <span className={styles.commentTotal}>{commentCount}</span>
          </button>

          <button className={styles.shareButton}>↗️ Share</button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;