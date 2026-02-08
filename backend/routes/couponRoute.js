// import express from 'express';
// import { createCoupon, getCoupons, deleteCoupon } from '../controllers/couponController.js';
// import adminAuth from '../middleware/adminAuth.js';

// const router = express.Router();

// router.post('/add', adminAuth, createCoupon);
// router.get('/list', adminAuth, getCoupons);

// router.delete('/delete/:id', adminAuth, deleteCoupon);

// export default router;
import express from 'express';
import { createCoupon, getCoupons, deleteCoupon } from '../controllers/couponController.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/add', adminAuth, createCoupon);
router.get('/list', adminAuth, getCoupons);
router.delete('/delete/:id', adminAuth, deleteCoupon);

export default router;
