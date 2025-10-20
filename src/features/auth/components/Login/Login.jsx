// import { useNavigate } from "react-router-dom";

// export default function Form() {
//     const navigate = useNavigate();

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         const username = event.target.username.value;
//         const password = event.target.password.value;

//         fetch("http://localhost:8080/api/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ username, password }),
//         })
//             .then((res) => {
//                 if (!res.ok) {
//                     throw new Error("Login failed");
//                 }
//                 return res.json();
//             })
//             .then((data) => {
//                 console.log("Đăng nhập thành công:", data);
//                 sessionStorage.setItem("userId", data.user.id);
//                 sessionStorage.setItem("token", data.token);
//                 navigate("/users");
//                 window.location.reload(); // ✅ đảm bảo App đọc lại token
//             })
//             .catch((err) => {
//                 alert("Sai tài khoản hoặc mật khẩu");
//                 console.error(err);
//             });
//     };

//     return (
//         <div>
//             <h2>Đăng nhập</h2>
//             <form onSubmit={handleSubmit}>
//                 <label htmlFor="username">Username:</label>
//                 <input type="text" id="username" name="username" required />
//                 <br />
//                 <label htmlFor="password">Password:</label>
//                 <input type="password" id="password" name="password" required />
//                 <br />
//                 <input type="submit" value="Đăng nhập" />
//             </form>
//             <p>
//                 Chưa có tài khoản?{" "}
//                 <span
//                     style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
//                     onClick={() => navigate("/users/new")}
//                 >
//                     Đăng ký ngay
//                 </span>
//             </p>
//         </div>
//     );
// }

// pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

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

  return (
    <form onSubmit={handleLogin}>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;