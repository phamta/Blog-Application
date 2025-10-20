// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { refreshAccessToken } from "../utils/userHelpers";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  // Hàm logout (xóa token)
  const logout = () => {
    setAccessToken(null);
    // Có thể gọi API logout nếu backend hỗ trợ
    // fetch("http://localhost:8080/api/logout", { method: "POST", credentials: "include" });
  };

  // Hàm lấy token mới khi cần (ví dụ lúc fetchWithAuth gặp 401)
  const handleRefreshToken = async () => {
    try {
      const newToken = await refreshAccessToken();
      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout, handleRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}