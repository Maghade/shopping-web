
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const colors = {
  primary: "#7FAD39",
  secondary: "#252E4D",
};

/* -------- DATE HELPERS -------- */
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDateLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString();
};

export default function Chats() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  const token = localStorage.getItem("token");

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ---------- SOCKET ---------- */
  useEffect(() => {
    axios.get(`${backendUrl}/api/chat/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      setMessages(res.data.messages || []);
      setTimeout(scrollToBottom, 100);
    });

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: { userId, role: "user" },
    });

    socketRef.current.on("connect", () => setSocketConnected(true));
    socketRef.current.on("disconnect", () => setSocketConnected(false));

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages(prev =>
        prev.some(m => m._id === msg._id) ? prev : [...prev, msg]
      );
      scrollToBottom();
    });

    socketRef.current.on("typing", () => {
      setIsTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1500);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
   socketRef.current.emit("sendMessage", {
  userId: userId,   // ⭐ ADD THIS
  content: input,
  sender: { id: userId, name: user.name, role: "user" },
});

    setInput("");
  };

  const sendFile = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("sender", JSON.stringify({ id: userId, name: user.name }));
    await axios.post(`${backendUrl}/api/chat/send-file`, formData);
    setFile(null);
  };

  let lastDate = null;

  return (
    <div style={pageStyles.container}>
      <div style={styles.chatContainer}>
        {/* HEADER */}
        <div style={styles.header}>
          <strong>{user?.name}</strong>
          <span style={styles.status}>
            {socketConnected ? "Online" : "Connecting..."}
          </span>
        </div>

        {/* SEARCH */}
        <div style={styles.searchWrapper}>
          <input
            style={styles.searchInput}
            placeholder="Search messages…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* MESSAGES */}
        <div style={styles.messages}>
          {messages
            .filter(m =>
              (m.content || m.fileName || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map(m => {
              const isUser = m.sender?.id === userId;
              const msgDate = formatDateLabel(m.createdAt);
              const showDate = msgDate !== lastDate;
              lastDate = msgDate;

              return (
                <React.Fragment key={m._id}>
                  {showDate && <div style={styles.dateLabel}>{msgDate}</div>}

                  <div style={{
                    display: "flex",
                    justifyContent: isUser ? "flex-end" : "flex-start"
                  }}>
                    <div
                      style={{
                        ...styles.bubble,
                        background:
                          m.type === "image" || m.type === "document"
                            ? "transparent"
                            : isUser ? colors.primary : "#fff",
                        color: isUser ? "#fff" : "#000",
                      }}
                    >
                      {m.type === "text" && <div>{m.content}</div>}

                      {m.type === "image" && (
                        <img
                          src={`${backendUrl}${m.fileUrl}`}
                          alt=""
                          style={styles.image}
                          onClick={() =>
                            setPreviewImage(`${backendUrl}${m.fileUrl}`)
                          }
                        />
                      )}

                      {m.type === "document" && (
                        <a
                          href={`${backendUrl}${m.fileUrl}`}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.fileCard}
                        >
                          📄 {m.fileName}
                        </a>
                      )}

                      <div style={styles.time}>
                        {formatTime(m.createdAt)}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

          {isTyping && <div style={styles.typing}>Typing…</div>}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div style={styles.inputWrapper}>
          <input type="file" hidden id="file" onChange={e => setFile(e.target.files[0])} />
          <label htmlFor="file" style={styles.attachBtn}>📎</label>

          <input
            style={styles.input}
            value={input}
            placeholder="Type a message"
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />

          <button style={styles.sendBtn} onClick={sendMessage}>➤</button>

          {file && (
            <button style={styles.fileSendBtn} onClick={sendFile}>
              Send
            </button>
          )}
        </div>
      </div>

      {/* IMAGE MODAL */}
      {previewImage && (
        <div style={styles.imageModal} onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="" style={styles.imageModalImg} />
          <span style={styles.closeBtn}>✕</span>
        </div>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const pageStyles = {
  container: {
    width: "100vw",
    height: "100vh",
    background: "#e5ddd5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

const styles = {
  chatContainer: {
    width: 480,
    height: "90vh",
    background: "#f8f9fa",
    borderRadius: 12,
    border: "1px solid #dcdcdc",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  header: {
    padding: 14,
    background: colors.secondary,
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
  },

  status: { fontSize: 12, opacity: 0.8 },

  searchWrapper: { padding: 8 },
  searchInput: {
    width: "100%",
    padding: 8,
    borderRadius: 20,
    border: "1px solid #ccc",
  },

  messages: {
    flex: 1,
    padding: 14,
    overflowY: "auto",
  },

  bubble: {
    maxWidth: "70%",
    padding: 10,
    marginBottom: 8,
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.05)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  },

  image: {
    maxWidth: 220,
    borderRadius: 10,
    border: "1px solid #ddd",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    cursor: "zoom-in",
  },

  fileCard: {
    padding: 10,
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #ccc",
    display: "inline-block",
    textDecoration: "none",
    color: "#252E4D",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  },

  time: { fontSize: 10, textAlign: "right", opacity: 0.6 },
  typing: { fontSize: 12, fontStyle: "italic" },
  dateLabel: { textAlign: "center", opacity: 0.6, margin: 10 },

  inputWrapper: {
    display: "flex",
    padding: 10,
    gap: 6,
    borderTop: "1px solid #ddd",
    background: "#fff",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 25,
    border: "1px solid #ccc",
  },

  sendBtn: {
    background: colors.secondary,
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 42,
    height: 42,
  },

  attachBtn: { fontSize: 20, cursor: "pointer" },

  fileSendBtn: {
    background: colors.primary,
    color: "#fff",
    borderRadius: 20,
    padding: "6px 12px",
    border: "none",
  },

  imageModal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  imageModalImg: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: 12,
    border: "2px solid #fff",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
  },

  closeBtn: {
    position: "absolute",
    top: 20,
    right: 30,
    color: "#fff",
    fontSize: 28,
    cursor: "pointer",
  },
};


