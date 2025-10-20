import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function NotificationListener() {
  const currentUserId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");

  const [notifications, setNotifications] = useState([]);
  const stompClientRef = useRef(null);

  useEffect(() => {
    if (!currentUserId || !token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        console.log("Connected to notifications WS");

        client.subscribe(`/topic/notifications/${currentUserId}`, (message) => {
          const notif = JSON.parse(message.body);
          setNotifications((prev) => [...prev, notif]);
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
      console.log("Disconnected from notifications WS");
    };
  }, [currentUserId, token]);

  return (
    <div>
      <h3>🔔 Notifications</h3>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((n, index) => (
            <li key={index}>{n.message || JSON.stringify(n)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}