// src/features/auth/services/authAPI.js
const API_BASE = "http://localhost:8080/api/auth";

export const authAPI = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Đăng nhập thất bại");
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_BASE}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Đăng xuất thất bại");
    return res;
  },

  refresh: async () => {
    const res = await fetch(`${API_BASE}/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Token không hợp lệ");
    return res.json();
  },
};
