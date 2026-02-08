import express from 'express';
import adminAuth from '../middleware/adminAuth.js';
import{ sendMessage, getMessage } from '../controllers/messageController.js';

const router = express.Router();
 router.post('/send', sendMessage);
 router.get('/get', adminAuth, getMessage);

export default router;