import { useState, useEffect } from "react";
import { getUserById, updateUserAvatar, deleteUser } from "../services/userAPI";

export function useUsers(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info
  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserById(userId);
        setUser(data);
      } catch (err) {
        setError(err.message || "Lỗi tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    }
    if (userId) fetchUser();
  }, [userId]);

  // Update avatar
  const handleUpdateAvatar = async (imageBlob) => {
    try {
      await updateUserAvatar(userId, imageBlob);
      const updatedUser = await getUserById(userId);
      setUser(updatedUser);
    } catch (err) {
      setError("Lỗi cập nhật avatar");
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    try {
      await deleteUser(userId);
      setUser(null);
    } catch (err) {
      setError("Lỗi khi xóa người dùng");
    }
  };

  return {
    user,
    loading,
    error,
    handleUpdateAvatar,
    handleDeleteUser,
  };
}