
import Chat from "../models/chatModel.js";
// GET ALL MESSAGES
export const getMessagesByUserId = async (req, res) => {
  try {
    const messages = await Chat.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch {
    res.status(500).json({ success: false });
  }
};

// export const sendFileMessage = async (req, res) => {
//   try {
//     const { userId, sender } = req.body;
//     const file = req.file;

//     if (!file) return res.status(400).json({ message: "No file uploaded" });

//     let type = "document";
//     if (file.mimetype.startsWith("image")) type = "image";
//     else if (file.mimetype.startsWith("video")) type = "video";
//     else if (file.mimetype.startsWith("audio")) type = "audio";

//     const newMessage = await Chat.create({
//       userId,
//       type,
//       sender: JSON.parse(sender),
//       fileUrl: `/uploads/${file.filename}`,
//       fileName: file.originalname,
//       fileType: file.mimetype,
//       status: "delivered",
//     });

//     // 🔥 REALTIME SEND
//     req.io.to(`user-${userId}`).emit("receiveMessage", newMessage);
//     req.io.to("admin").emit("receiveMessage", newMessage);

//     res.status(201).json(newMessage);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "File upload failed" });
//   }
// };


// controllers/chatController.js
export const sendFileMessage = async (req, res) => {
  try {
    const { userId, sender } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let type = "document";
    if (file.mimetype.startsWith("image")) type = "image";
    else if (file.mimetype.startsWith("video")) type = "video";
    else if (file.mimetype.startsWith("audio")) type = "audio";

    const message = await Chat.create({
      userId,
      type,
      sender: JSON.parse(sender),
      fileUrl: `/uploads/${file.filename}`,
      fileName: file.originalname,
      fileType: file.mimetype,
      status: "delivered",
    });

    // 🔥 REALTIME
    req.io.to(`user-${userId}`).emit("receiveMessage", message);
    req.io.to("admin").emit("receiveMessage", message);

    res.status(201).json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "File upload failed" });
  }
};