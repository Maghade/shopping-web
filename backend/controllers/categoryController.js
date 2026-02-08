import { Category, SubCategory } from "../models/categoryModel.js";import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 Add Category

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const imagePaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const newCategory = new Category({
      name,
      images: imagePaths,
    });

    await newCategory.save();

    res.json({
      success: true,
      message: "Category added successfully",
      category: newCategory,
    });

    console.log("📸 Uploaded files:", req.files);

  } catch (error) {
    console.error("❌ Error adding category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    // Preserve existing images
    let images = category.images || [];

    if (req.files && req.files.length > 0) {
      // Replace or merge old + new depending on your needs:
      images = [...images, ...req.files.map(f => `/uploads/${f.filename}`)];
    }

    category.name = name;
    category.images = images;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Error updating category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


 const listCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({
        path: "subcategories",
        populate: {
          path: "subSubCategories",
        },
      });

    // console.log("📚 Categories with populated subcategories:", JSON.stringify(categories, null, 2));

    res.json({ success: true, categories });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 📌 Remove Category
const removeCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Category removed successfully." });
  } catch (error) {
    console.error("Error removing category:", error);
    res.json({ success: false, message: error.message });
  }
};

// 📌 Single Category
const singleCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId).populate("subcategories");
    res.json({ success: true, category });
  } catch (error) {
    console.error("Error fetching single category:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addCategory, removeCategory, listCategories, singleCategory, updateCategory };
