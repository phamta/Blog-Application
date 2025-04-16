import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import User from "./User"; // Import component User

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/all")
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
    // console.log(`User ${userId} clicked`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách người dùng</h2>
      <button
        onClick={() => navigate("/users/new")}
        style={{
          marginBottom: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add User
      </button>
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
