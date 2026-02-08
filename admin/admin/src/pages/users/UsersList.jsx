
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { FaPaperclip } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { io } from "socket.io-client";
// import { useMessages } from "../../context/MessageContext"; // ⭐ NEW

// export const backendUrl = import.meta.env.VITE_BACKEND_URL;
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || backendUrl;

// export default function UsersList() {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [typingUser, setTypingUser] = useState("");

//   const { unreadCounts, resetUnread } = useMessages(); // ⭐ USE GLOBAL

//   const socketRef = useRef(null);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const token = localStorage.getItem("token");

//   /* ---------------- FETCH USERS ---------------- */
//   useEffect(() => {
//     axios
//       .get(`${backendUrl}/api/user/user-list`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(({ data }) => {
//         setUsers(data.users || []);
//         setFilteredUsers(data.users || []);
//       })
//       .catch(() => toast.error("Failed to load users"));
//   }, []);

//   useEffect(() => {
//     const term = searchTerm.toLowerCase();
//     setFilteredUsers(
//       users.filter(
//         (u) =>
//           u.name?.toLowerCase().includes(term) ||
//           u.email?.toLowerCase().includes(term)
//       )
//     );
//   }, [searchTerm, users]);

//   /* ---------------- SOCKET ---------------- */
//   useEffect(() => {
//     socketRef.current = io(SOCKET_URL, {
//       auth: { token, role: "admin" },
//       transports: ["websocket"],
//     });

//     return () => socketRef.current.disconnect();
//   }, []);

//   useEffect(() => {
//     const socket = socketRef.current;
//     if (!socket) return;

//     socket.on("receiveMessage", (msg) => {
//       if (selectedUser && msg.userId === selectedUser._id) {
//         setMessages((prev) =>
//           prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
//         );
//         scrollToBottom();
//       }
//       // ❌ NO unread logic here anymore (handled globally)
//     });

//     socket.on("typing", ({ userId, name }) => {
//       if (selectedUser && userId === selectedUser._id) {
//         setTypingUser(`${name} is typing...`);
//         setTimeout(() => setTypingUser(""), 1500);
//       }
//     });

//     return () => {
//       socket.off("receiveMessage");
//       socket.off("typing");
//     };
//   }, [selectedUser]);

//   /* ---------------- LOAD CHAT ---------------- */
//   const handleChat = async (user) => {
//     setSelectedUser(user);
//     setMessages([]);

//     resetUnread(user._id); // ⭐ RESET GLOBAL UNREAD

//     try {
//       const { data } = await axios.get(`${backendUrl}/api/chat/${user._id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessages(data.messages || []);
//       scrollToBottom();
//     } catch {
//       toast.error("Failed to load chat");
//     }
//   };

//   /* ---------------- SEND MESSAGE ---------------- */
//   const sendAdminMsg = () => {
//     if (!input.trim() || !selectedUser) return;

//     socketRef.current.emit("sendMessage", {
//       userId: selectedUser._id,
//       content: input,
//       sender: { id: "admin", role: "admin", name: "Admin" },
//     });

//     setInput("");
//   };

//   /* ---------------- FILE UPLOAD ---------------- */
//   const handleFileUpload = async (file) => {
//     if (!file || !selectedUser) return;

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("userId", selectedUser._id);
//     formData.append(
//       "sender",
//       JSON.stringify({ id: "admin", role: "admin", name: "Admin" })
//     );

//     try {
//       await axios.post(`${backendUrl}/api/chat/send-file`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });
//     } catch {
//       toast.error("File upload failed");
//     }
//   };

//   const scrollToBottom = () =>
//     setTimeout(
//       () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
//       100
//     );

//   /* ⭐ MERGE GLOBAL UNREAD WITH USERS */
//   const usersWithUnread = filteredUsers.map((u) => ({
//     ...u,
//     unreadCount: unreadCounts[u._id] || 0,
//   }));

//   return (
//     <div className="h-screen flex bg-gray-100">
//       {/* LEFT PANEL */}
//       <div className="w-[320px] bg-white border-r flex flex-col">
//         <div className="p-4 border-b font-semibold text-lg bg-[#252E4D] text-white">
//           All Contacts
//         </div>

//         <div className="p-3 border-b">
//           <input
//             className="w-full p-2 border rounded-md text-sm"
//             placeholder="Search name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {usersWithUnread.map((u) => (
//             <div
//               key={u._id}
//               onClick={() => handleChat(u)}
//               className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-gray-100 ${
//                 selectedUser?._id === u._id ? "bg-gray-200" : ""
//               }`}
//             >
//               {u.profilePic ? (
//                 <img
//                   src={u.profilePic}
//                   alt={u.name}
//                   className="w-11 h-11 rounded-full object-cover border"
//                 />
//               ) : (
//                 <div className="w-11 h-11 rounded-full bg-[#252E4D] text-white flex items-center justify-center font-semibold">
//                   {u.name?.charAt(0).toUpperCase()}
//                 </div>
//               )}

//               <div className="flex-1 overflow-hidden">
//                 <p className="font-medium text-sm truncate">{u.name}</p>
//                 <p className="text-xs text-gray-500 truncate">{u.email}</p>
//               </div>

//               {u.unreadCount > 0 && (
//                 <span className="bg-red-500 text-white text-xs px-2 py-[2px] rounded-full">
//                   {u.unreadCount}
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="flex-1 flex flex-col">
//         {selectedUser ? (
//           <>
//             <div className="bg-[#252E4D] text-white px-5 py-3">
//               <p className="font-semibold">{selectedUser.name}</p>
//               {typingUser && (
//                 <p className="text-xs text-[#7FAD39]">{typingUser}</p>
//               )}
//             </div>

//             <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#e5ddd5]">
//               {messages.map((m) => {
//                 const isAdmin = m.sender?.role === "admin";
//                 return (
//                   <div key={m._id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
//                     <div
//                       className={`max-w-[60%] px-3 py-2 rounded-xl shadow text-sm ${
//                         isAdmin
//                           ? "bg-[#7FAD39] text-white rounded-br-none"
//                           : "bg-white rounded-bl-none"
//                       }`}
//                     >
//                       {m.type === "text" && <p>{m.content}</p>}
//                       {m.type === "image" && (
//                         <img src={`${backendUrl}${m.fileUrl}`} className="rounded-lg max-h-52" />
//                       )}
//                       {m.type === "document" && (
//                         <a
//                           href={`${backendUrl}${m.fileUrl}`}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="flex items-center gap-2 bg-gray-100 p-2 rounded"
//                         >
//                           📄 {m.fileName}
//                         </a>
//                       )}
//                       <div className="text-[10px] mt-1 text-right opacity-70">
//                         {new Date(m.createdAt).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="p-3 flex items-center gap-2 bg-white border-t">
//               <button
//                 onClick={() => fileInputRef.current.click()}
//                 className="text-gray-500 hover:text-[#7FAD39] text-xl"
//               >
//                 <FaPaperclip />
//               </button>

//               <input
//                 type="file"
//                 hidden
//                 ref={fileInputRef}
//                 onChange={(e) => handleFileUpload(e.target.files[0])}
//               />

//               <input
//                 className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#7FAD39]"
//                 placeholder="Type a message"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendAdminMsg()}
//               />

//               <button
//                 onClick={sendAdminMsg}
//                 className="bg-[#7FAD39] text-white px-5 py-2 rounded-full"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
//             Select a user to start chatting
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaPaperclip } from "react-icons/fa";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { useMessages } from "../../context/MessageContext";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || backendUrl;

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageSearch, setMessageSearch] = useState(""); // ⭐ NEW
  const [input, setInput] = useState("");
  const [typingUser, setTypingUser] = useState("");

  const { unreadCounts, resetUnread } = useMessages();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  /* ---------------- FETCH USERS ---------------- */
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/user/user-list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        setUsers(data.users || []);
        setFilteredUsers(data.users || []);
      })
      .catch(() => toast.error("Failed to load users"));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFilteredUsers(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, users]);

  /* ---------------- SOCKET ---------------- */
  useEffect(() => {
    socketRef.current = io(SOCKET_URL, {
      auth: { token, role: "admin" },
      transports: ["websocket"],
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.on("receiveMessage", (msg) => {
      if (selectedUser && msg.userId === selectedUser._id) {
        setMessages((prev) =>
          prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]
        );
        scrollToBottom();
      }
    });

    socket.on("typing", ({ userId, name }) => {
      if (selectedUser && userId === selectedUser._id) {
        setTypingUser(`${name} is typing...`);
        setTimeout(() => setTypingUser(""), 1500);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, [selectedUser]);

  /* ---------------- LOAD CHAT ---------------- */
  const handleChat = async (user) => {
    setSelectedUser(user);
    setMessages([]);
    setMessageSearch(""); // reset search when switching user
    resetUnread(user._id);

    try {
      const { data } = await axios.get(`${backendUrl}/api/chat/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(data.messages || []);
      scrollToBottom();
    } catch {
      toast.error("Failed to load chat");
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendAdminMsg = () => {
    if (!input.trim() || !selectedUser) return;

    socketRef.current.emit("sendMessage", {
      userId: selectedUser._id,
      content: input,
      sender: { id: "admin", role: "admin", name: "Admin" },
    });

    setInput("");
  };

  /* ---------------- FILE UPLOAD ---------------- */
  const handleFileUpload = async (file) => {
    if (!file || !selectedUser) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", selectedUser._id);
    formData.append(
      "sender",
      JSON.stringify({ id: "admin", role: "admin", name: "Admin" })
    );

    try {
      await axios.post(`${backendUrl}/api/chat/send-file`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch {
      toast.error("File upload failed");
    }
  };

  const scrollToBottom = () =>
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      100
    );

  /* ---------------- MESSAGE SEARCH FILTER ---------------- */
  const messagesToShow = messageSearch
    ? messages.filter(
        (m) =>
          m.type === "text" &&
          m.content?.toLowerCase().includes(messageSearch.toLowerCase())
      )
    : messages;

  /* ---------------- DATE HELPERS ---------------- */
  const isToday = (date) =>
    new Date(date).toDateString() === new Date().toDateString();

  const isYesterday = (date) => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return new Date(date).toDateString() === y.toDateString();
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ⭐ MERGE GLOBAL UNREAD WITH USERS */
  const usersWithUnread = filteredUsers.map((u) => ({
    ...u,
    unreadCount: unreadCounts[u._id] || 0,
  }));

  return (
    <div className="h-screen flex bg-gray-100">
      {/* LEFT PANEL */}
      <div className="w-[320px] bg-white border-r flex flex-col">
        <div className="p-4 border-b font-semibold text-lg bg-[#252E4D] text-white">
          All Contacts
        </div>

        <div className="p-3 border-b">
          <input
            className="w-full p-2 border rounded-md text-sm"
            placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {usersWithUnread.map((u) => (
            <div
              key={u._id}
              onClick={() => handleChat(u)}
              className={`flex items-center gap-3 p-3 cursor-pointer border-b hover:bg-gray-100 ${
                selectedUser?._id === u._id ? "bg-gray-200" : ""
              }`}
            >
              {u.profilePic ? (
                <img src={u.profilePic} className="w-11 h-11 rounded-full object-cover border" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#252E4D] text-white flex items-center justify-center font-semibold">
                  {u.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sm truncate">{u.name}</p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>

              {u.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-[2px] rounded-full">
                  {u.unreadCount}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="bg-[#252E4D] text-white px-5 py-3">
              <p className="font-semibold">{selectedUser.name}</p>
              {typingUser && <p className="text-xs text-[#7FAD39]">{typingUser}</p>}
            </div>

            {/* 🔍 MESSAGE SEARCH BAR */}
            <div className="p-2 bg-[#f0f2f5] border-b">
              <input
                type="text"
                placeholder="Search messages..."
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7FAD39]"
              />
            </div>

            {/* 💬 MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#e5ddd5]">
              {messagesToShow.map((m, index) => {
                const isAdmin = m.sender?.role === "admin";
                const currentDate = getDateLabel(m.createdAt);
                const prev = messagesToShow[index - 1];
                const prevDate = prev ? getDateLabel(prev.createdAt) : null;
                const showDateHeader = currentDate !== prevDate;

                return (
                  <React.Fragment key={m._id}>
                    {showDateHeader && (
                      <div className="flex justify-center my-2">
                        <span className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full">
                          {currentDate}
                        </span>
                      </div>
                    )}

                    <div className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[60%] px-3 py-2 rounded-xl shadow text-sm ${
                          isAdmin
                            ? "bg-[#7FAD39] text-white rounded-br-none"
                            : "bg-white rounded-bl-none"
                        }`}
                      >
                        {m.type === "text" && <p>{m.content}</p>}
                        {m.type === "image" && (
                          <img src={`${backendUrl}${m.fileUrl}`} className="rounded-lg max-h-52" />
                        )}
                        {m.type === "document" && (
                          <a
                            href={`${backendUrl}${m.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 bg-gray-100 p-2 rounded"
                          >
                            📄 {m.fileName}
                          </a>
                        )}
                        <div className="text-[10px] mt-1 text-right opacity-70">
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 flex items-center gap-2 bg-white border-t">
              <button onClick={() => fileInputRef.current.click()} className="text-gray-500 hover:text-[#7FAD39] text-xl">
                <FaPaperclip />
              </button>

              <input type="file" hidden ref={fileInputRef} onChange={(e) => handleFileUpload(e.target.files[0])} />

              <input
                className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-[#7FAD39]"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAdminMsg()}
              />

              <button onClick={sendAdminMsg} className="bg-[#7FAD39] text-white px-5 py-2 rounded-full">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
