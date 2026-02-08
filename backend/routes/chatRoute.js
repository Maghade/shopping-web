// // import express from "express";
// // import { getMessagesByUserId , sendMessage} from "../controllers/chatController.js";

// // const router = express.Router();

// // router.get("/:userId", getMessagesByUserId);
// // router.post("/send", sendMessage);
// // export default router;


// import express from "express";
// import {
//   getMessagesByUserId,
//   sendMessage,
//   sendFileMessage,
// } from "../controllers/chatController.js";
// import  upload  from "../middleware/multer.js";

// const router = express.Router();

// router.get("/:userId", getMessagesByUserId);
// router.post("/send", sendMessage);

// // 🔥 FILE MESSAGE
// router.post("/send-file", upload.single("file"), sendFileMessage);

// export default router;import express from "express";

import express from "express";

import {
  getMessagesByUserId,
  sendFileMessage,
} from "../controllers/chatController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/:userId", getMessagesByUserId);

// 🔥 FILE MESSAGE ROUTE
router.post("/send-file", upload.single("file"), sendFileMessage);

export default router;
