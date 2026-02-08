


import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import routes from "./routes/index.js";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// 🔥 Make io accessible in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(routes);

io.on("connection", (socket) => {
  const { userId, role } = socket.handshake.auth;

  console.log("🔌 Connected:", userId, role);

  // User joins their personal room
  if (userId) socket.join(`user-${userId}`);

  // Admin joins admin room
  if (role === "admin") socket.join("admin");

  // ================= SEND MESSAGE (USER OR ADMIN) =================
socket.on("sendMessage", async ({ userId, content, sender }) => {
  try {
    const Chat = (await import("./models/chatModel.js")).default;

    const saved = await Chat.create({
      userId,            // ⭐ ALWAYS use this
      content,
      sender,
      type: "text",
      status: "delivered",
    });

    // Send to that specific user
    io.to(`user-${userId}`).emit("receiveMessage", saved);

    // Send to all admins
    io.to("admin").emit("receiveMessage", saved);

  } catch (err) {
    console.error("Message error:", err);
  }
});

  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", userId);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
