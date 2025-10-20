import { getToken } from "../utils/userHelper";

const API_BASE = "http://localhost:8080/api/users";

// Get user by ID
export async function getUserById(userId) {
  const response = await fetch(`${API_BASE}/${userId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Không tìm thấy người dùng");
  return response.json();
}

// Update avatar
export async function updateUserAvatar(userId, imageBlob) {
  const formData = new FormData();
  formData.append("file", imageBlob);

  const response = await fetch(`${API_BASE}/${userId}/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  if (!response.ok) throw new Error("Cập nhật avatar thất bại");
  return response.json();
}

// Delete user
export async function deleteUser(userId) {
  const response = await fetch(`${API_BASE}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) throw new Error("Xóa người dùng thất bại");
  return response.json();
}