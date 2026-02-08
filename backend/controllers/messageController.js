import Message from "../models/messageModel.js";  // ✅ notice the .js extension
const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }    
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }

};  
const getMessage = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });    
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};  

export { sendMessage, getMessage };