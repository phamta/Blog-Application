import React, { useEffect, useState } from "react"; // Import React và các hooks cần thiết
import { useNavigate } from "react-router-dom"; // Import hook để điều hướng
import User from "./User"; // Import component User để hiển thị thông tin người dùng

export default function UserList() {
  const [users, setUsers] = useState([]); // Khởi tạo state `users` để lưu danh sách người dùng
  const navigate = useNavigate(); // Hook để điều hướng đến các trang khác

  // 🟢 Hàm xử lý logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");         // Xoá JWT token
    sessionStorage.removeItem("userId");        // Xoá userId nếu có
    navigate("/login");                       // Điều hướng về trang đăng nhập
  };

  // useEffect để gọi API khi component được render lần đầu tiên
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Lấy token từ sessionStorage để xác thực
    console.log("Token:", token); // Log token ra console để kiểm tra

    // Gửi yêu cầu GET đến API để lấy danh sách người dùng
    fetch("http://localhost:8080/api/all", {
      headers: {
        "Content-Type": "application/json", // Định dạng dữ liệu gửi đi
        Authorization: `Bearer ${token}`, // Thêm token vào header để xác thực
      },
    })
      .then((response) => {
        // Kiểm tra nếu phản hồi không thành công
        if (!response.ok) {
          navigate("/login"); // Nếu không thành công, điều hướng đến trang đăng nhập
        }
        return response.json(); // Chuyển đổi dữ liệu từ JSON sang đối tượng JavaScript
      })
      .then((data) => {
        setUsers(data); // Cập nhật danh sách người dùng vào state `users`
      })
      .catch((error) => {
        console.error("Error fetching users:", error); // Log lỗi nếu có vấn đề xảy ra
      });
  }, []); // Mảng phụ thuộc rỗng để đảm bảo useEffect chỉ chạy một lần khi component được render

  // Hàm xử lý khi người dùng được nhấp
  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`); // Điều hướng đến trang chi tiết người dùng với userId
  };

  // Render giao diện
  return (
    <div style={{ padding: "20px" }}>
       {/* 🔴 Nút Logout ở góc */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}></div>
      <h2>Danh sách người dùng</h2>
      <button onClick={handleLogout} style={{ padding: "8px 12px", backgroundColor: "red", color: "white", border: "none", borderRadius: "4px" }}>
          Đăng xuất
        </button>
      {users.length === 0 ? ( // Kiểm tra nếu danh sách người dùng rỗng
        <p>Loading...</p> // Hiển thị "Loading..." nếu dữ liệu chưa được tải
      ) : (
        // Duyệt qua danh sách người dùng và render component User cho từng người dùng
        users.map((user) => (
          <User key={user.id} user={user} onClick={handleUserClick} />
        ))
      )}
    </div>
  );
}