// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  // Hàm logout
  const logout = async () => {
    setAccessToken(null);
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include", // cookie gửi kèm
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Refresh token từ backend
  const refreshAccessToken = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.error("Refresh token failed:", err);
      logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}