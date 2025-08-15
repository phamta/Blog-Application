// src/hooks/UserDetailHooks.js
import { useEffect, useState } from "react";
import {
  getUserDetail,
  getUserPosts,
  deleteUser,
  getPostComments,
  addComment,
  toggleLike,
} from "../UserDetail/UserDetailAPI";

export const useUserDetail = (userId, token, navigate) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentToggle, setCommentToggle] = useState({});
  const [newComments, setNewComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const userIdFromStorage = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!token) {
      alert("Bạn cần đăng nhập để xem thông tin.");
      navigate("/login");
      return;
    }

    getUserDetail(userId, token).then(setUser).catch(console.error);

    getUserPosts(userId, token)
      .then(data => setPosts(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))))
      .catch(console.error);
  }, [userId, token, navigate]);

  const handleUpdate = () => navigate(`/update/${userId}`);
  const handleCreatePost = () => navigate(`/create-post/${userId}`);

  const handleDelete = () => {
    if (!token) return;
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      deleteUser(userId, token)
        .then(res => {
          if (!res.ok) throw new Error("Failed to delete user");
          alert("Người dùng đã được xóa thành công");
          navigate("/");
        })
        .catch(console.error);
    }
  };

  const toggleComments = (postId) => {
    setCommentToggle(prev => {
      const newState = { ...prev, [postId]: !prev[postId] };
      if (newState[postId] && !postComments[postId]) {
        getPostComments(postId, token)
          .then(data => {
            setPostComments(prevComments => ({
              ...prevComments,
              [postId]: data,
            }));
          })
          .catch(console.error);
      }
      return newState;
    });
  };

  const handleCommentChange = (postId, value) => {
    setNewComments(prev => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!content) return;
    if (!userIdFromStorage) {
      alert("Bạn cần đăng nhập để bình luận");
      return;
    }

    try {
      const response = await addComment(userIdFromStorage, postId, content, token);
      if (!response.ok) throw new Error("Gửi bình luận thất bại");
      setNewComments(prev => ({ ...prev, [postId]: "" }));

      const updatedComments = await getPostComments(postId, token);
      setPostComments(prev => ({ ...prev, [postId]: updatedComments }));

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, comments: updatedComments } : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeToggle = async (postId, isLiked) => {
    if (!userIdFromStorage) {
      alert("Bạn cần đăng nhập để thả tim");
      return;
    }
    try {
      const response = await toggleLike(userIdFromStorage, postId, isLiked, token);
      if (!response.ok) throw new Error("Lỗi khi thả tim");
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? {
                ...post,
                isLike: !isLiked,
                likeCount: isLiked
                  ? Math.max(0, post.likeCount - 1)
                  : post.likeCount + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return {
    user,
    posts,
    commentToggle,
    newComments,
    postComments,
    userIdFromStorage,
    handleUpdate,
    handleCreatePost,
    handleDelete,
    toggleComments,
    handleCommentChange,
    handleCommentSubmit,
    handleLikeToggle,
  };
};
