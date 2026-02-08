import express from 'express';
import { loginUser, registerUser, adminLogin, generateHash,  verifyEmail ,forgotPassword, resetPassword, createRequest, userList} from '../controllers/userController.js';
import authUser from '../middleware/auth.js'

import upload from '../middleware/multer.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/admin', adminLogin)
userRouter.get('/hash', generateHash)
userRouter.get('/verify/:token', verifyEmail);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.post('/requests', createRequest);
userRouter.get("/user-list", authUser, userList);



export default userRouter;