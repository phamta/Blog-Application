import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs"; // ✅ Dùng @stomp/stompjs

export default function Messager() {
  const { userId } = useParams();
  const currentUserId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [chatPartners, setChatPartners] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(userId);
  const [newMessage, setNewMessage] = useState("");

  const stompClientRef = useRef(null);

  // Kết nối WebSocket
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("Connected via STOMP");

        client.subscribe(`/topic/messages/${currentUserId}`, (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          if (
            receivedMessage.senderId == selectedPartner ||
            receivedMessage.receiverId == selectedPartner
          ) {
            setMessages((prev) => [...prev, receivedMessage]);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      console.log("Disconnected");
    };
  }, [currentUserId, selectedPartner]);

  // Lấy danh sách đối tác
  useEffect(() => {
    fetch(`http://localhost:8080/api/messages/partners/${currentUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setChatPartners);
  }, []);

  // Lấy lịch sử trò chuyện
  useEffect(() => {
    if (!selectedPartner) return;
    fetch(
      `http://localhost:8080/api/messages/conversation?user1=${currentUserId}&user2=${selectedPartner}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then(setMessages);
  }, [selectedPartner]);

  // Gửi tin nhắn
  const handleSendMessage = () => {
    const client = stompClientRef.current;
    if (!newMessage.trim() || !client?.connected) return;

    const message = {
      senderId: parseInt(currentUserId),
      receiverId: parseInt(selectedPartner),
      content: newMessage,
      sentAt: new Date().toISOString(), // thêm thời gian ngay
      senderUsername: "Bạn", // hoặc lấy từ localStorage nếu cần
    };

    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(message),
    });

    // ✅ Hiển thị ngay bên phía người gửi
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div style={{ display: "flex", height: "90vh" }}>
      <div
        style={{ width: "30%", borderRight: "1px solid #ccc", padding: "10px" }}
      >
        <h3>Đã từng nhắn tin</h3>
        <ul>
          {chatPartners.map((partner) => (
            <li key={partner.id}>
              <button onClick={() => setSelectedPartner(partner.id)}>
                {partner.username}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          width: "70%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
          <h3>Lịch sử trò chuyện</h3>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                textAlign: msg.senderId == currentUserId ? "right" : "left",
              }}
            >
              <p>
                <strong>{msg.senderUsername || ""}</strong> {msg.content}
              </p>
              <small>{new Date(msg.sentAt).toLocaleString()}</small>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "10px", display: "flex" }}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            style={{ flexGrow: 1, padding: "8px" }}
          />
          <button
            onClick={handleSendMessage}
            style={{ marginLeft: "5px", padding: "8px 12px" }}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
