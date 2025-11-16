import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import styles from "./Login.module.css";
import { UserCircle, Lock } from "lucide-react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();

      setAccessToken(data.accessToken);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  // Login với Google
  const handleGoogleLogin = () => {
    // Redirect trực tiếp tới Spring Security OAuth2 endpoint
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className={styles.body}>
      <div className={styles.wrapper}>
        <form action="">
          <h1>Login</h1>
          <div className={styles.inputBox}>
            <input
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="bx bxs-user"></i>
          </div>

          <div className={styles.inputBox}>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className={styles.rememberForgot}>
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className={styles.btn} onClick={handleLogin}>
            Login
          </button>

          <div className={styles.registerLink}>
            <p>
              Don't have an account? <a href="#">Register</a>
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className={styles.btn}
            style={{ marginTop: "10px", backgroundColor: "#4285F4" }}
          >
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
