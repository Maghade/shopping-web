// import express from 'express'
// import { listProducts, removeProduct, singleProduct, updateProduct, addProduct} from '../controllers/productController.js'
// import upload from '../middleware/multer.js';
// import adminAuth from '../middleware/adminAuth.js';

// const productRouter = express.Router();

// // productRouter.post('/add', upload.array('files',10), addProduct);

// productRouter.post('/add', upload.array('files', 10), addProduct);

// productRouter.post('/remove', adminAuth, removeProduct); 
// productRouter.get('/single/:id', singleProduct);
// productRouter.get('/list',listProducts)
// productRouter.put('/update/:id', upload.array('files', 10), updateProduct);



// export default productRouter





import express from "express";
import {
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
  addProduct,
} from "../controllers/productController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", upload.array("files", 10), addProduct);
productRouter.post("/remove", removeProduct);
productRouter.get("/single/:id", singleProduct);
productRouter.get("/list", listProducts);
productRouter.put("/update/:id", upload.array("files", 10), updateProduct);

export default productRouter;
