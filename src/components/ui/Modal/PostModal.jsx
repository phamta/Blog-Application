import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Send } from "lucide-react";
import CommentList from "../../../features/posts/components/Comment/CommentList";
import styles from "./PostModal.module.css";
import { getUserIdFromToken } from "../../../utils/jwtHelper";

Modal.setAppElement("#root");

const PostModal = ({ postId, accessToken, onClose }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  // 🔹 Lấy thông tin user đang đăng nhập
  useEffect(() => {
    const fetchUser = async () => {
      const userId = getUserIdFromToken(accessToken);
      if (!userId) return;

      try {
        const res = await fetch(`http://localhost:8080/api/user/sumary/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Lỗi tải user:", err);
      }
    };

    fetchUser();
  }, [accessToken]);

  // 🔹 Lấy bài viết và comment
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await fetch(`http://localhost:8080/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const postData = await postRes.json();
        setPost(postData);

        const commentRes = await fetch(
          `http://localhost:8080/api/comments/post/${postId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const commentData = await commentRes.json();
        setComments(commentData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    if (postId && accessToken) fetchData();
  }, [postId, accessToken]);

  // 🔹 Gửi comment mới
  const handleSendComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          postId,
          userId: user?.id,
          content: newComment.trim(),
        }),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi bình luận");

      const savedComment = await res.json();
      setComments((prev) => [...prev, savedComment]);
      setNewComment("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={!!postId}
      onRequestClose={onClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      {post && (
        <>
          {/* 🔹 Header: Avatar + Username + Thời gian */}
          <div className={styles.header}>
            <img
              src={post.author?.imageUrl || "/default-avatar.png"}
              alt="avatar"
              className={styles.avatar}
            />
            <div>
              <h4>{post.author?.username || "Ẩn danh"}</h4>
              <span className={styles.time}>
                {new Date(post.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* 🔹 Nội dung bài viết */}
          <div className={styles.postSection}>
            <p>{post.title}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt="post" className={styles.postImage} />
            )}
          </div>

          {/* 🔹 Ô nhập comment */}
          <div className={styles.commentInput}>
            <img
              src={post.author?.imageUrl || "/default-avatar.png"}
              alt="avatar"
              className={styles.avatar}
            />
            <input
              type="text"
              placeholder={`Bình luận với tư cách ${user?.username || "người dùng"}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendComment()}
            />
            <button onClick={handleSendComment} title="Gửi bình luận">
              <Send size={18} />
            </button>
          </div>

          {/* 🔹 Danh sách bình luận */}
          <div className={styles.commentSection}>
            <h5>Bình luận ({comments.length})</h5>
            <CommentList comments={comments} />
          </div>
        </>
      )}
    </Modal>
  );
};

export default PostModal;