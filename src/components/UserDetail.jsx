import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Post from "./Post";
import "../css/UserDetail.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentToggle, setCommentToggle] = useState({});
  const [newComments, setNewComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:8080/api/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user details:", err));

    fetch(`http://localhost:8080/api/posts/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
        const sortedPosts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
      })
      .catch((err) => console.error("Error fetching posts:", err));
  }, [userId]);

  const handleUpdate = () => navigate(`/update/${userId}`);

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      fetch(`http://localhost:8080/api/delete/${userId}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to delete user");
          alert("Người dùng đã được xóa thành công");
          navigate("/");
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  const handleCreatePost = () => {
    navigate(`/create-post/${userId}`);
  };

  const toggleComments = (postId) => {
    setCommentToggle((prev) => {
      const newState = { ...prev, [postId]: !prev[postId] };

      if (newState[postId] && !postComments[postId]) {
        fetch(`http://localhost:8080/api/comments/post/${postId}`)
          .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch comments");
            return res.json();
          })
          .then((data) => {
            setPostComments((prevComments) => ({
              ...prevComments,
              [postId]: data,
            }));
          })
          .catch((err) => console.error("Error fetching comments:", err));
      }

      return newState;
    });
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const content = newComments[postId]?.trim();
    if (!content) return;

    const userIdFromStorage = localStorage.getItem("userId");

    if (!userIdFromStorage) {
      alert("Bạn cần đăng nhập để bình luận");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userIdFromStorage),
          postId,
          content,
        }),
      });
  
      if (!response.ok) throw new Error("Gửi bình luận thất bại");
  
      // Xoá nội dung sau khi gửi
      setNewComments((prev) => ({ ...prev, [postId]: "" }));
  
      // Cập nhật lại danh sách comment
      const res = await fetch(`http://localhost:8080/api/comments/post/${postId}`);
      if (!res.ok) throw new Error("Tải lại bình luận thất bại");
      const updatedComments = await res.json();
  
      setPostComments((prev) => ({
        ...prev,
        [postId]: updatedComments,
      }));
  
      // Cập nhật lại số lượng comments cho post (tuỳ bạn có muốn hay không)
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: updatedComments }
            : post
        )
      );
    } catch (error) {
      console.error("Lỗi khi gửi comment:", error);
    }
  };
  

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="userInfo">
        <h2>{user.username}</h2>
        <p>Email: {user.email}</p>
        <p>Ngày sinh: {user.birthday}</p>
        {user.imageData && user.imageType && (
          <img
            src={`data:${user.imageType};base64,${user.imageData}`}
            alt={user.username}
            className="profileImage"
          />
        )}
        <div className="buttonContainer">
          <button onClick={handleUpdate} className="button">
            Update
          </button>
          <button onClick={handleDelete} className="button deleteButton">
            Delete
          </button>
          <button
            onClick={handleCreatePost}
            className="button createPostButton"
          >
            Tạo bài đăng
          </button>
        </div>
      </div>

      <div className="postContainer">
        <h3>Bài viết của {user.username}</h3>
        {posts.length === 0 ? (
          <p style={{ textAlign: "center" }}>Không có bài viết nào.</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
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
    </div>
  );
}

export default UserDetail;