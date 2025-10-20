// src/utils/jwtHelper.js
import {jwtDecode} from "jwt-decode";

export function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token); // Giải mã token
    // Giả sử token chứa { userId: 5, sub: "username", exp: ... }
    return decoded.userId || decoded.id || decoded.sub || null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}