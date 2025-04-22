import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    birthday: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const formattedBirthday = data.birthday
          ? new Date(data.birthday).toISOString().split("T")[0]
          : "";
        setFormData({
          username: data.username || "",
          email: data.email || "",
          birthday: formattedBirthday,
        });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, [userId]);  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/update/info/${userId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        alert("Người dùng đã được cập nhật thành công");
        navigate(`/user/${userId}`);
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Cập nhật người dùng</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ngày sinh:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Cập nhật
        </button>
      </form>
    </div>
  );
}
