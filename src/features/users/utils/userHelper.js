// Lấy token từ localStorage
export function getToken() {
  return localStorage.getItem("token");
}

// Lấy userId hiện tại từ localStorage
export function getCurrentUserId() {
  return localStorage.getItem("userId");
}

// Format ngày sinh
export function formatBirthday(dateStr) {
  if (!dateStr) return "Không rõ";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}