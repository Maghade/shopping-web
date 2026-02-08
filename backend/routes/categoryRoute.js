// import express from 'express'
// import { addCategory, listCategories, removeCategory, singleCategory, updateCategory } from '../controllers/categoryController.js'
// // import adminAuth from '../middleware/adminAuth.js';
// import upload from '../middleware/multer.js';

// const categoryRouter = express.Router();

// categoryRouter.post('/add', upload.none(), addCategory);
// categoryRouter.post('/remove', removeCategory);
// categoryRouter.get('/single/:id', singleCategory);
// categoryRouter.get('/list', listCategories)
// categoryRouter.put('/update/:id', upload.none(), updateCategory);


// export default categoryRouter

import express from 'express'
import { 
  addCategory, 
  listCategories, 
  removeCategory, 
  singleCategory, 
  updateCategory 
} from '../controllers/categoryController.js'
import upload from '../middleware/multer.js';

const categoryRouter = express.Router();

// ✅ Accept single image file for add/update
categoryRouter.post('/add', upload.array("images", 5), addCategory);
categoryRouter.put('/update/:id', upload.array("images", 5), updateCategory);

categoryRouter.post('/remove', removeCategory);
categoryRouter.get('/single/:id', singleCategory);
categoryRouter.get('/list', listCategories);

export default categoryRouter;
