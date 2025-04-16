import React from "react";

export default function User({ user, onClick }) {
  return (
    <div
      onClick={() => onClick(user.id)}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px 0",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
      }}
    >
      {user.imageData && user.imageType ? (
        <img
          src={`data:${user.imageType};base64,${user.imageData}`}
          alt={user.username}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
      ) : (
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: "#ddd",
            marginRight: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          No Image
        </div>
      )}
      <div>
        <h3>{user.username}</h3>
        <p>Ngày sinh: {user.birthday ? user.birthday : "N/A"}</p>
      </div>
    </div>
  );
}