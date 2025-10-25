// pages/Home.jsx

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { fetchWithAuth } from "../utils/userHelpers";
import { getUserIdFromToken } from "../utils/jwtHelper";
import PostList from "../features/posts/components/PostList/PostList";
import Navbar from "../components/layout/Navbar/Navbar";
import styles from "./Home.module.css";
import PostModal from "../components/ui/Modal/PostModal";

function Home() {
  const { accessToken, handleRefreshToken } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const size = 5;

  // ✅ Lấy thông tin user
  useEffect(() => {
    if (!accessToken) return;
    const userId = getUserIdFromToken(accessToken);
    if (!userId) return;

    const loadUser = async () => {
      try {
        const data = await fetchWithAuth(
          `http://localhost:8080/api/user/sumary/${userId}`,
          accessToken,
          handleRefreshToken
        );
        setUser(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    loadUser();
  }, [accessToken, handleRefreshToken]);
  const userId = user?.id || getUserIdFromToken(accessToken);

  // ✅ Lấy danh sách bài viết
  const fetchPosts = useCallback(async () => {
    if (!accessToken || !hasMore) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/posts/paginated?page=${page}&size=${size}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!res.ok) throw new Error("Không thể tải bài viết");

      const data = await res.json();
      if (data.length === 0) setHasMore(false);
      else setPosts((prev) => [...prev, ...data]);
      console.log("Bài viết tải về:", data);
    } catch (err) {
      console.error("Lỗi tải bài viết:", err);
    }
  }, [page, accessToken, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, [hasMore]);

  // ✅ Xử lý khi nhấn like
  const handleLike = async (postId, isLiked) => {
    console.log(
      "User ID khi like:",
      userId,
      "Post ID:",
      postId,
      "isLiked:",
      isLiked
    );

    try {
      const url = isLiked
        ? `http://localhost:8080/api/likes/userId/${userId}/postId/${postId}` // POST
        : `http://localhost:8080/api/likes/unlike/userId/${userId}/postId/${postId}`; // DELETE

      const res = await fetch(url, {
        method: isLiked ? "POST" : "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error("Lỗi khi like/unlike bài viết");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Xử lý comment
  const handleComment = (postId) => {
    console.log("Mở modal bình luận cho bài viết ID:", postId);
    setSelectedPostId(postId);
  };

  const closeModal = () => {
    setSelectedPostId(null);
  };

  // ✅ Xử lý share
  const handleShare = (postId) => {
    const link = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(link);
    alert("Đã sao chép liên kết bài viết!");
  };

  return (
    <>
      <Navbar />

      <div>
        <h2>Trang chủ</h2>
        {user ? <p>Xin chào, {user.username}</p> : <p>Đang tải...</p>}

        {/* ✅ Truyền sự kiện xuống PostList */}
        <PostList
          posts={posts}
          onLike={handleLike}
          onComment={handleComment}
          // onShare={handleShare}
        />

        {hasMore ? (
          <div ref={loader} style={{ textAlign: "center", padding: "10px" }}>
            <p>Đang tải thêm...</p>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>Hết bài rồi 🎉</p>
        )}
      </div>

      {selectedPostId && (
        <PostModal
          postId={selectedPostId}
          onClose={closeModal}
          accessToken={accessToken}
        />
      )}
    </>
  );
}

export default Home;
