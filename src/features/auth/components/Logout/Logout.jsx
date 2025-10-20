// src/components/Logout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🟢 Xoá token và userId trong sessionStorage
    // sessionStorage.removeItem("token");
    // sessionStorage.removeItem("userId");

    // Có thể gọi API backend để xoá refreshToken (nếu bạn triển khai ở backend)
    fetch("http://localhost:8080/api/auth/logout", { method: "POST", credentials: "include" });

    // 🔴 Điều hướng về trang login
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "8px 12px",
        backgroundColor: "red",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Đăng xuất
    </button>
  );
}
