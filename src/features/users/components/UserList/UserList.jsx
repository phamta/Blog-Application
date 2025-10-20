import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "../../../../components/User";
import Logout from "./Logout"; // 🟢 Import component Logout

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("Token:", token);

    fetch("http://localhost:8080/api/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          navigate("/login");
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Danh sách người dùng</h2>
        <Logout /> {/* 🔴 Gọi nút Logout ở đây */}
      </div>

      {users.length === 0 ? (
        <p>Loading...</p>
      ) : (
        users.map((user) => (
          <User key={user.id} user={user} onClick={handleUserClick} />
        ))
      )}
    </div>
  );
}
