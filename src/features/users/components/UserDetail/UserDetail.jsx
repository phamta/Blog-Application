// src/components/UserDetail/UserDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserDetail } from "../../../../components/UserDetail/UserDetailHooks";
import UserInfo from "../UserInfo";
import PostList from "../PostList";
import "../../css/UserDetail.css";

export default function UserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const {
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
  } = useUserDetail(userId, token, navigate);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <UserInfo
        user={user}
        userIdFromStorage={userIdFromStorage}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete}
        handleCreatePost={handleCreatePost}
      />
      <PostList
        posts={posts}
        user={user}
        commentToggle={commentToggle}
        postComments={postComments}
        newComments={newComments}
        toggleComments={toggleComments}
        handleCommentChange={handleCommentChange}
        handleCommentSubmit={handleCommentSubmit}
        handleLikeToggle={handleLikeToggle}
      />
    </div>
  );
}
