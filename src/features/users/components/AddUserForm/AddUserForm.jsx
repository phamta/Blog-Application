import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUserForm() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    birthday: "",
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );
    if (image) {
      formData.append("image", image);
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token để xác thực
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Lỗi khi tạo user");
        }
        return response.json();
      })
      .then((data) => {
        console.log("User created:", data);
        navigate("/users");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <h2>Thêm User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={user.birthday}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ảnh đại diện:</label>
          <input type="file" name="image" onChange={handleImageChange} />
        </div>
        <button type="submit">Thêm User</button>
      </form>
    </div>
  );
}
