import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import UserList from "./components/UserList";
import AddUserForm from "./components/AddUserForm";
import UserDetail from "./components/UserDetail";
import UpdateUser from "./components/UpdateUser";
import CreatePost from "./components/CreatePost";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
    if (!token || !userId) {
      setIsAuthenticated(false);
      setCheckingToken(false);
      return;
    }

    axios
      .get("http://localhost:8080/api/check-token", {
        headers: { 
          Authorization: `Bearer ${token}`,
          userId: Number(userId) // Thêm userId vào headers
        },
      })
      .then(() => {
        setIsAuthenticated(true);
        setCheckingToken(false);
      })
      .catch((err) => {
        console.log("Token không hợp lệ hoặc hết hạn:", err.response?.data);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");  // Xóa userId nếu token không hợp lệ
        setIsAuthenticated(false);
        setCheckingToken(false);
      });
  }, []);


  if (checkingToken) return <div>Đang kiểm tra token...</div>;

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <UserList /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={
              isAuthenticated ? <UserList /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/users/new"
            element={
              isAuthenticated ? <AddUserForm /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/user/:userId"
            element={
              isAuthenticated ? <UserDetail /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/update/:userId"
            element={
              isAuthenticated ? <UpdateUser /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/create-post/:userId"
            element={
              isAuthenticated ? <CreatePost /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;