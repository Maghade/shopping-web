import express from "express";
import userRouter from "./userRoute.js";
import productRouter from "./productRoute.js";
import cartRouter from "./cartRoute.js";
import orderRouter from "./orderRoute.js";
import categoryRouter from "./categoryRoute.js";
import couponRouter from "./couponRoute.js";
import bundleRouter from "./bundleRoute.js";
import messageRouter from "./messageRoute.js";
import subcategoryRouter from "./subcategoryRoute.js";
import chatRouter from "./chatRoute.js";
const router = express.Router();

router.use("/api/user", userRouter);
router.use("/api/product", productRouter);
router.use("/api/cart", cartRouter);
router.use("/api/order", orderRouter);
router.use("/api/category", categoryRouter);
router.use("/api/coupon", couponRouter);
router.use("/api/bundle", bundleRouter);
router.use("/api/messages", messageRouter);
router.use("/api/subcategory", subcategoryRouter);
router.use("/api/chat", chatRouter);

export default router;

// import express from 'express';
// import userRouter from './userRoute.js';
// import productRouter from './productRoute.js';
// import cartRouter from './cartRoute.js';
// import orderRouter from './orderRoute.js';
// import categoryRouter from './categoryRoute.js';
// import couponRouter from './couponRoute.js';
// import reportRouter from './reportRoute.js';
// import bundleRouter from './bundleRoute.js'

// import messageRouter from './messageRoute.js';
// const router = express.Router();

// router.use('/api/user', userRouter);
// router.use('/api/product', productRouter);
// router.use('/api/cart', cartRouter);
// router.use('/api/order', orderRouter);
// router.use('/api/category', categoryRouter);
// router.use('/api/coupon', couponRouter);
// router.use('/api/report', reportRouter);

// router.use('/api/bundle',bundleRouter)
// router.use('/api/messages',messageRouter)

// export default router;
