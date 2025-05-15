import React from "react";
import "../css/User.css"; // Import file CSS

export default function User({ user, onClick }) {
  return (
    <div className="user-card" onClick={() => onClick(user.id)}>
      {user.imageData && user.imageType ? (
        <img
          src={`data:${user.imageType};base64,${user.imageData}`}
          alt={user.username}
        />
      ) : (
        <div className="placeholder">No Image</div>
      )}
      <div>
        <h3>{user.username}</h3>
        <p>Ngày sinh: {user.birthday ? user.birthday : "N/A"}</p>
      </div>
    </div>
  );
} 