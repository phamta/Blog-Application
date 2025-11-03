// utils/tokenHelper.js
export async function refreshAccessToken() {
  const res = await fetch("http://localhost:8080/api/auth/refresh", {
    method: "POST",
    credentials: "include", // gửi kèm refreshToken cookie
  });

  if (!res.ok){
    console.log(`Refresh token hết hạn hoặc không hợp lệ`);
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  return data.accessToken;
}

export async function fetchWithAuth(url, accessToken, setAccessToken) {
  let res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Nếu accessToken hết hạn → thử refresh
  if (res.status === 401) {
    try {
      const newToken = await refreshAccessToken();
      setAccessToken(newToken);

      // gọi lại request với token mới
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
    } catch (err) {
      throw new Error("Phiên đăng nhập hết hạn, vui lòng login lại");
    }
  }

  return res.json();
}
