import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateUser() {
  const { userId } = useParams(); // Lấy `userId` từ URL thông qua hook `useParams`
  const navigate = useNavigate(); // Hook để điều hướng đến các trang khác
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    birthday: "",
  }); // Khởi tạo state `formData` để lưu thông tin người dùng

  // useEffect để gọi API lấy thông tin người dùng khi component được render
  useEffect(() => {
    fetch(`http://localhost:8080/api/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Thêm token vào header để xác thực
      },
    })
      .then((response) => response.json()) // Chuyển đổi dữ liệu từ JSON sang đối tượng JavaScript
      .then((data) => {
        // Định dạng ngày sinh (nếu có) thành định dạng `YYYY-MM-DD` để hiển thị trong input type="date"
        const formattedBirthday = data.birthday
          ? new Date(data.birthday).toISOString().split("T")[0]
          : "";
        // Cập nhật state `formData` với dữ liệu từ API
        setFormData({
          username: data.username || "",
          email: data.email || "",
          birthday: formattedBirthday,
        });
      })
      .catch((error) => console.error("Error fetching user data:", error)); // Log lỗi nếu có vấn đề xảy ra
  }, [userId]); // Chỉ chạy lại khi `userId` thay đổi

  // Hàm xử lý khi người dùng thay đổi giá trị trong các input
  const handleChange = (e) => {
    const { name, value } = e.target; // Lấy `name` và `value` từ input
    setFormData({ ...formData, [name]: value }); // Cập nhật state `formData` với giá trị mới
  };

  // Hàm xử lý khi form được submit
  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form (reload trang)
    fetch(`http://localhost:8080/api/update/info/${userId}`, {
      method: "PUT", // Gửi yêu cầu PUT để cập nhật thông tin người dùng
      headers: { 
        "Content-Type": "application/json", // Định dạng dữ liệu gửi đi
        "Authorization": `Bearer ${localStorage.getItem("token")}`, // Thêm token vào header để xác thực
      },
      body: JSON.stringify(formData), // Chuyển đổi `formData` thành chuỗi JSON để gửi đi
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update user");
        }
        alert("Người dùng đã được cập nhật thành công"); // Hiển thị thông báo thành công
        navigate(`/user/${userId}`); // Điều hướng về trang chi tiết người dùng
      })
      .catch((error) => console.error("Error updating user:", error));
  };

  // Render giao diện
  return (
    <div style={{ padding: "20px" }}>
      <h2>Cập nhật người dùng</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username} // Giá trị hiện tại của `username`
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email} // Giá trị hiện tại của `email`
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Ngày sinh:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday} // Giá trị hiện tại của `birthday`
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