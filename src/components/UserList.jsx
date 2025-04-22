import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "./User";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    console.log("Token:", token);

    fetch("http://localhost:8080/api/all", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
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
      <h2>Danh sách người dùng</h2>
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
