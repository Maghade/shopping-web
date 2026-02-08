



import { Category,SubCategory } from "../models/categoryModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Add a new Subcategory
export const addSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    if (!name || !category) {
      return res.status(400).json({ success: false, message: "Name and Category are required" });
    }

    const newSubcategory = new SubCategory({
      name,
      image: imagePath,
      category,
    });

    await newSubcategory.save();

    // Optionally push subcategory ID into Category
    await Category.findByIdAndUpdate(category, {
      $push: { subcategories: newSubcategory._id },
    });

    res.status(201).json({ success: true, subcategory: newSubcategory });
  } catch (error) {
    console.error("Error adding subcategory:", error);
    res.status(500).json({ success: false, message: "Failed to add subcategory" });
  }
};

// 📌 List all Subcategories (with category info)
export const listSubcategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate("category", "name _id");
    res.json({ success: true, subcategories });
  } catch (error) {
    console.error("Error listing subcategories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch subcategories" });
  }
};

// 📌 Get single Subcategory by ID
export const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id)
      .populate("category", "name _id");

    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    res.json({ success: true, subcategory });
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ success: false, message: "Failed to fetch subcategory" });
  }
};
// 📌 Update Subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const subcategory = await SubCategory.findById(req.params.id);

    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    // Handle image replacement
    let imagePath = subcategory.image;
    if (req.file) {
      if (subcategory.image) {
        const oldPath = path.join(__dirname, "..", subcategory.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    subcategory.name = name || subcategory.name;
    subcategory.category = category || subcategory.category;
    subcategory.image = imagePath;

    await subcategory.save();

    res.json({ success: true, message: "Subcategory updated successfully", subcategory });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({ success: false, message: "Failed to update subcategory" });
  }
};

// 📌 Delete Subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id);
    if (!subcategory) {
      return res.status(404).json({ success: false, message: "Subcategory not found" });
    }

    if (subcategory.image) {
      const imagePath = path.join(__dirname, "..", subcategory.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await SubCategory.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ success: false, message: "Failed to delete subcategory" });
  }
};

export const getSingleSubcategory = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.id).populate("category");    
    if (!subcategory) {
        return res.status(404).json({ success: false, message: "Subcategory not found" });    
    }
    res.json({ success: true, subcategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); 
    }
};