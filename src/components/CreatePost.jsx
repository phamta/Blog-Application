import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreatePost() {
  const { userId } = useParams();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", userId); // Thay bằng userId thực tế
    formData.append("title", title);
    if (image) {
        formData.append("image", image);
    }

    try {
        const response = await fetch("http://localhost:8080/api/posts/upload", {
            method: "POST",
            body: formData,
        });

        console.log("Response status:", response.status);
        
        const responseText = await response.text();
        console.log("Response text:", responseText);

        if (!response.ok) {
            throw new Error(responseText);
        }

        alert("Bài đăng đã được tạo thành công");
        navigate("/");
    } catch (error) {
        console.error("Error creating post:", error.message);
        alert("Đã xảy ra lỗi: " + error.message);
    }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tạo bài đăng</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tiêu đề:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Ảnh:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Đăng bài
        </button>
      </form>
    </div>
  );
}