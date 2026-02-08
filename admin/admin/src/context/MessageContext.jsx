import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const MessageContext = createContext();
export const useMessages = () => useContext(MessageContext);

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || backendUrl;

export const MessageProvider = ({ children }) => {
  const [unreadCounts, setUnreadCounts] = useState({});
  const socketRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      auth: { token, role: "admin" },
      transports: ["websocket"],
    });

    socketRef.current.on("receiveMessage", (msg) => {
      setUnreadCounts((prev) => ({
        ...prev,
        [msg.userId]: (prev[msg.userId] || 0) + 1,
      }));
    });

    return () => socketRef.current.disconnect();
  }, []);

  const resetUnread = (userId) => {
    setUnreadCounts((prev) => ({ ...prev, [userId]: 0 }));
  };

  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <MessageContext.Provider value={{ unreadCounts, totalUnread, resetUnread }}>
      {children}
    </MessageContext.Provider>
  );
};
