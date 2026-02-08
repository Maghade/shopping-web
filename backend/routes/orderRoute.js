import express from "express";
import { listOrders, removeOrder, adminListOrders } from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";

const router = express.Router();

router.get("/list", authUser, listOrders);
router.post("/remove", authUser, removeOrder);
router.get("/admin-list", authUser, adminListOrders);

export default router;