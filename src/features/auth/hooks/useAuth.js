// src/features/auth/hooks/authHooks.js
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { authAPI } from "../services/authAPI";
// import { authHelper } from "../utils/authHelper";

export function useAuthActions() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const login = async (username, password) => {
    try {
      const data = await authAPI.login(username, password);
      setAccessToken(data.accessToken);
      // authHelper.saveToken(data.accessToken);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error(err);
    } finally {
      // authHelper.removeToken();
      setAccessToken(null);
      navigate("/login");
    }
  };

  return { login, logout };
}