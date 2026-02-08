import express from "express";
import {
  addSubcategory,
  listSubcategories,
  getSingleSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/subcategoryController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ✅ Parse FormData (even if no files)
router.post("/add", upload.none(), addSubcategory);
router.put("/update/:id", upload.none(), updateSubcategory);

router.get("/list", listSubcategories);
router.get("/get/:id", getSingleSubcategory);
router.delete("/delete/:id", deleteSubcategory);

export default router;
