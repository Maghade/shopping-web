
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import axios from "axios";
import { FaComments, FaTrash, FaPaperclip } from "react-icons/fa";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || backendUrl;

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [showChat, setShowChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [attachment, setAttachment] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const itemsPerPage = 5;

  // ---------------- FETCH USERS ----------------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/user-list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      } else toast.error(data.message || "Failed to fetch users");
    } catch {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter((u) => {
      const name = u.name?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";
      return name.includes(term) || email.includes(term);
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // ---------------- SOCKET ----------------
  useLayoutEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      auth: { token, role: "admin", userId: "admin" },
    });

    socketRef.current.on("connect", () => console.log("Socket connected as admin"));

    // receive messages from users
    socketRef.current.on("receiveMessage", (msg) => {
      if (selectedUser?._id === msg.userId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    });

    // typing indicator
    socketRef.current.on("typing", ({ userId, name }) => {
      if (selectedUser?._id === userId) {
        setTypingUser(`${name} is typing...`);
        setTimeout(() => setTypingUser(""), 1500);
      }
    });

    return () => socketRef.current.disconnect();
  }, [selectedUser]);

  // ---------------- JOIN USER ROOM ----------------
  useEffect(() => {
    if (selectedUser && socketRef.current) {
      socketRef.current.emit("joinUser", { role: "admin", userId: selectedUser._id });
    }
  }, [selectedUser]);

  // ---------------- PAGINATION ----------------
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ---------------- CHAT ----------------
  const handleChat = async (user) => {
    setShowChat(true);
    setSelectedUser(user);
    setMessages([]);

    try {
      const { data } = await axios.get(`${backendUrl}/api/chat/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data.messages || []);
    } catch {
      toast.error("Error fetching chat messages");
    }

    // join room for selected user
    socketRef.current.emit("joinUser", { userId: user._id, role: "admin" });
  };

  const sendMessage = () => {
    if (!input.trim() && !attachment) return;

    const msg = {
      userId: selectedUser._id,
      content: input,
      attachment,
      sender: {
        id: "admin",
        name: "Admin",
        role: "admin",
      },
      createdAt: new Date().toISOString(),
    };

    // optimistic UI
    setMessages((prev) => [...prev, msg]);
    scrollToBottom();

    // ✅ FIX: emit admin message to user
    socketRef.current.emit("sendAdminMessage", msg);

    setInput("");
    setAttachment(null);
  };

  const handleTyping = () => {
    if (socketRef.current && selectedUser) {
      socketRef.current.emit("typing", { userId: selectedUser._id, name: "Admin" });
    }
  };

  const handleCloseChat = () => {
    if (socketRef.current && selectedUser) {
      socketRef.current.emit("leaveRoom", { userId: selectedUser._id });
    }
    setShowChat(false);
    setSelectedUser(null);
    setMessages([]);
    setInput("");
    setAttachment(null);
    setTypingUser("");
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="p-4">
      <p className="mb-4 font-semibold text-xl">All User Requests</p>

      <input
        type="text"
        placeholder="Search by user or email..."
        className="w-full p-3 mb-4 border rounded-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <div className="flex flex-col gap-2">
          {currentItems.map((item, i) => (
            <div key={i} className="grid grid-cols-4 border p-2">
              <p>{item.name}</p>
              <p>{item.email}</p>
              <div className="flex gap-3 justify-center">
                <FaComments onClick={() => handleChat(item)} className="cursor-pointer" />
                <FaTrash className="cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHAT MODAL */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-[#f0f0f0] w-full max-w-xl h-[85vh] rounded-lg flex flex-col shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 bg-[#252E4D] text-white rounded-t-lg">
              <div>
                <p className="font-semibold">{selectedUser?.name}</p>
                {typingUser && <p className="text-xs text-[#7FAD39]">{typingUser}</p>}
              </div>
              <button onClick={handleCloseChat}>✖</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {messages.map((m, idx) => {
                const isAdmin = m.sender?.role === "admin";
                return (
                  <div key={idx} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow
                      ${isAdmin ? "bg-[#7FAD39] text-white rounded-br-none" : "bg-white text-black rounded-bl-none"}`}>
                      <p>{m.content}</p>
                      {m.attachment && (
                        <div className="mt-1">
                          {m.attachment.url?.match(/\.(jpeg|jpg|png|gif)$/) ? (
                            <img src={m.attachment.url} alt={m.attachment.name} className="max-w-full rounded mt-1" />
                          ) : (
                            <a href={m.attachment.url} target="_blank" className="text-blue-600 underline">
                              {m.attachment.name}
                            </a>
                          )}
                        </div>
                      )}
                      <div className="text-[10px] text-gray-200 text-right mt-1 flex justify-end items-center gap-1">
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {isAdmin && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2 12l5 5 12-12-1.414-1.414L7 14.172l-3.586-3.586L2 12z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-[#f0f0f0] flex gap-2 items-center">
              <label className="cursor-pointer text-[#252E4D]">
                <FaPaperclip size={20} />
                <input type="file" className="hidden" onChange={(e) => setAttachment(e.target.files[0])} />
              </label>
              <input
                className="flex-1 px-4 py-2 rounded-full border focus:outline-none"
                placeholder="Type a message"
                value={input}
                onChange={(e) => { setInput(e.target.value); handleTyping(); }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage} className="bg-[#7FAD39] text-white px-4 py-2 rounded-full">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import Chat from "./models/chatModel.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(routes);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const onlineUsers = new Map(); // ✅ GLOBAL

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.auth;

  if (!userId) {
    socket.disconnect();
    return;
  }

  console.log(`🟢 ${role} connected:`, userId);
  onlineUsers.set(userId, socket.id);

  // JOIN ROOM
  socket.join(`user-${userId}`);
  if (role === "admin") socket.join("admin");

  // SEND MESSAGE (both user & admin)
  socket.on("sendMessage", async (msg) => {
    try {
      const saved = await Chat.create({
        userId: msg.userId,
        content: msg.content,
        sender: msg.sender,
        attachment: msg.attachment || null,
        status: "delivered",
      });

      // Send to user
      io.to(`user-${msg.userId}`).emit("receiveMessage", saved);

      // Send to admin
      io.to("admin").emit("receiveMessage", saved);

    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  // TYPING
  socket.on("typing", ({ userId, name }) => {
    socket.to(`user-${userId}`).emit("typing", { name });
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    console.log("🔴 Disconnected:", userId);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
