
import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    userId: String,
    content: String,
    type: { type: String, default: "text" }, // text | image | video | audio | document
    fileUrl: String,
    fileName: String,
    fileType: String,
    sender: {
      id: String,
      name: String,
      role: String,
    },
    status: { type: String, default: "sent" },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);