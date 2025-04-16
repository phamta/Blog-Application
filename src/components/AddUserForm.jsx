import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function AddUserForm() {
  // Khởi tạo state cho thông tin user
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    birthday: "", // Add birthday field
  });

  // State cho file ảnh (nếu có)
  const [image, setImage] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  // Xử lý thay đổi input cho thông tin user
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Xử lý khi chọn file ảnh
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Xử lý submit form: gọi API tạo user
  const handleSubmit = (e) => {
    e.preventDefault();

    // Tạo FormData để gửi multipart/form-data
    const formData = new FormData();

    // Gắn thông tin user dưới dạng JSON
    formData.append(
      "user",
      new Blob([JSON.stringify(user)], { type: "application/json" })
    );

    // Nếu có file ảnh, gắn vào formData
    if (image) {
      formData.append("image", image);
    }

    // Gọi API với phương thức POST
    fetch("http://localhost:8080/api/add", {
      method: "POST",
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
        navigate("/users"); // Redirect to UserList page
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
            placeholder="Nhập username"
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
            placeholder="Nhập email"
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
            placeholder="Nhập password"
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
