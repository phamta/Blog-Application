// src/features/auth/components/Logout/Logout.jsx
import React from "react";
import { useAuthActions } from "../../hooks/useAuth";

export default function Logout() {
  const { logout } = useAuthActions();

  return (
    <button
      onClick={logout}
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
