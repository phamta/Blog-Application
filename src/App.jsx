// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { refreshAccessToken } from "./utils/userHelpers";
import Login from "./features/auth/components/Login/Login";
import Home from "./pages/Home";

function AppContent() {
  const { accessToken, setAccessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Khi reload, thử refresh token để lấy access token mới
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const newToken = await refreshAccessToken(); // gọi API refresh
        setAccessToken(newToken);
      } catch (err) {
        console.warn("Refresh token hết hạn hoặc không tồn tại → chuyển về login");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    tryRefresh();
  }, [navigate, setAccessToken]);

  if (loading) return <div style={{ padding: "2rem" }}>Đang kiểm tra phiên đăng nhập...</div>;

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Nếu chưa có token → tự động điều hướng sang login */}
        <Route
          path="/"
          element={
            accessToken ? (
              <Home />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
