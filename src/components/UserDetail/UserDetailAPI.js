// src/api/UserDetailAPI.js
const API_BASE = "http://localhost:8080/api";

export const getUserDetail = (userId, token) =>
  fetch(`${API_BASE}/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => {
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  });

export const getUserPosts = (userId, token) =>
  fetch(`${API_BASE}/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => {
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  });

export const deleteUser = (userId, token) =>
  fetch(`${API_BASE}/delete/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

export const getPostComments = (postId, token) =>
  fetch(`${API_BASE}/comments/post/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => {
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
  });

export const addComment = (userId, postId, content, token) =>
  fetch(`${API_BASE}/comments/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: +userId, postId, content }),
  });

export const toggleLike = (userId, postId, isLiked, token) =>
  fetch(
    isLiked
      ? `${API_BASE}/likes/unlike?userId=${userId}&postId=${postId}`
      : `${API_BASE}/likes/like?userId=${userId}&postId=${postId}`,
    {
      method: isLiked ? "DELETE" : "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
