
import express from 'express';

import { addBundles ,getList,updateBundle ,deleteBundle, singleBundle} from '../controllers/bundleController.js';

const router = express.Router();

router.post('/add', addBundles);  // ✅ This should handle POST requests
router.get("/getlist", getList);
router.put('/update/:id', updateBundle);
router.delete('/delete/:id', deleteBundle);
router.get('/single/:id',singleBundle)

export default router;
