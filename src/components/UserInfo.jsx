import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // thêm dòng này
import "../css/UserInfo.css"; // Import file CSS

export default function UserInfo({
  user,
  userIdFromStorage,
  handleUpdate,
  handleDelete,
  handleCreatePost,
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);

  const navigate = useNavigate(); // Khởi tạo useNavigate
  const handleMessage = () => {
    navigate(`/chat/${user.id}`);
  };

  const startCamera = () => {
    setShowCamera(true);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Không thể truy cập camera:", err);
        alert("Không thể truy cập camera. Vui lòng kiểm tra quyền.");
        setShowCamera(false); // Ẩn camera nếu có lỗi
      });
  };

  const captureAndUpload = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageBlob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", imageBlob);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      await fetch(`http://localhost:8080/api/users/${userId}/avatar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      alert("Cập nhật avatar thành công!");
      window.location.reload();
    } catch (err) {
      console.error("Lỗi khi tải ảnh lên:", err);
      alert("Lỗi khi cập nhật ảnh đại diện");
    }

    if (video.srcObject) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }

    setShowCamera(false);
  };

  return (
    <div className="userInfo">
      <h2>{user.username}</h2>
      <p>Email: {user.email}</p>
      <p>Ngày sinh: {new Date(user.birthday).toLocaleDateString()}</p>

      <div style={{ position: "relative", display: "inline-block" }}>
        {user.imageData && user.imageType && (
          <img
            src={`data:${user.imageType};base64,${user.imageData}`}
            alt={user.username}
            className="profileImage"
          />
        )}
        {user.id === Number(userIdFromStorage) && (
          <button
            onClick={startCamera}
            className="cameraButton"
            title="Thay ảnh đại diện"
          >
            📷
          </button>
        )}
      </div>

      {showCamera && (
        <div className="cameraPreview">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: "100%", maxWidth: "400px" }}
          ></video>
          <br />
          <button onClick={captureAndUpload}>Chụp & Cập nhật avatar</button>
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
      )}

      {user.id === Number(userIdFromStorage) ? (
        <div className="buttonContainer">
          <button onClick={handleUpdate} className="button">
            Update
          </button>
          <button onClick={handleDelete} className="button deleteButton">
            Delete
          </button>
          <button
            onClick={handleCreatePost}
            className="button createPostButton"
          >
            Tạo bài đăng
          </button>
        </div>
      ) : (
        <div className="buttonContainer">
          <button
            onClick={handleMessage}
            className="button messageButton"
          >
            Message
          </button>
        </div>
      )}
    </div>
  );
}
