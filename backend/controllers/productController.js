



import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import productModel from "../models/productModel.js";
import { Category } from "../models/categoryModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  ✅ UPDATE PRODUCT (Deletes old images if replaced)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      subCategories,
    
     size,
      customFields,
    } = req.body;

    // ✅ Parse subcategories safely
    let parsedSubCategories = [];
    if (subCategories) {
      try {
        parsedSubCategories = JSON.parse(subCategories);
      } catch {
        parsedSubCategories = Array.isArray(subCategories)
          ? subCategories
          : [subCategories];
      }
    }

    // ✅ Parse custom fields safely
    let parsedCustomFields = [];
    if (customFields) {
      try {
        parsedCustomFields = JSON.parse(customFields);
      } catch {
        parsedCustomFields = [];
      }
    }

    // ✅ Find existing product
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let updatedImages = existingProduct.images;

    // ✅ If new files uploaded → delete old ones
    if (req.files && req.files.length > 0) {
      // Delete old image files safely
      existingProduct.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
            console.log(`🗑️ Deleted old image: ${fullPath}`);
          } catch (err) {
            console.warn(`⚠️ Failed to delete ${fullPath}:`, err.message);
          }
        }
      });

      // Add new images
      updatedImages = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updateData = {
      name,
      description,
      price,
      category,
      subCategories: parsedSubCategories,
     
      size: size || "",
      customFields: parsedCustomFields,
      images: updatedImages,
    };

    const updatedProduct = await productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("category subCategories");

    res.json({
      success: true,
      message: "✅ Product updated successfully (old images removed if replaced)",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
;
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategories,
      brand,
      manufacturer,
      packing,
      strength,
      usageApplication,
      countryOfOrigin,
      customFields,
      size,
    } = req.body;

    // ✅ Validate required fields
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, and category are required fields",
      });
    }

    // ✅ Prevent duplicate products (name + category)
    const existing = await productModel.findOne({
      name: name.trim(),
      category,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists in selected category",
      });
    }

    // ✅ Parse subCategories safely
    let parsedSubCategories = [];
    if (subCategories) {
      try {
        parsedSubCategories = JSON.parse(subCategories);
      } catch {
        parsedSubCategories = Array.isArray(subCategories)
          ? subCategories
          : [subCategories];
      }
    }

    // ✅ remove empty values
    parsedSubCategories = parsedSubCategories.filter(
      (id) => id && id.trim() !== ""
    );

    // ✅ Parse custom fields safely
    let parsedCustomFields = [];
    if (customFields) {
      try {
        parsedCustomFields = JSON.parse(customFields);
      } catch {
        parsedCustomFields = [];
      }
    }

    // ✅ Handle images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    // ✅ Create product
    let newProduct = new productModel({
      name,
      description,
      price,
      category,
      subCategories: parsedSubCategories,
      brand,
      manufacturer,
      packing,
      strength,
      usageApplication,
      countryOfOrigin,
      customFields: parsedCustomFields,
      images,
      size,
    });

    await newProduct.save();

    // ✅ Return populated product
    newProduct = await productModel
      .findById(newProduct._id)
      .populate("category subCategories");

    res.json({
      success: true,
      message: "✅ Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



export const listProducts = async (req, res) => {
  try {
    const { category, subCategory, search } = req.query;

    const filter = {};

    // ✅ Category filter
    if (category && category !== "All") {
      filter.category = new mongoose.Types.ObjectId(category);
    }

    // ✅ Subcategory filter
    if (subCategory) {
      filter.subCategories = {
        $in: [new mongoose.Types.ObjectId(subCategory)],
      };
    }

    // ✅ ✅ Search by partial name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await productModel
      .find(filter)
      .populate("category subCategories");

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Error listing products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const singleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .populate("category", "name")
      .populate("subCategories", "name");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}



export const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // ✅ Delete associated images safely
    if (product.images?.length) {
      product.images.forEach((imgPath) => {
        const fullPath = path.join(__dirname, "..", imgPath);
        try {
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (err) {
          console.warn("⚠️ Error deleting image:", err.message);
        }
      });
    }

    // ✅ Use Mongoose's delete method
    await productModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "✅ Product removed successfully",
    });
  } catch (error) {
    console.error("❌ Error removing product:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// export const addProduct = async (req, res) => {
//   try {
//     console.log("📦 Incoming Product Data:", req.body);
//     console.log("📸 Uploaded Files:", req.files);

//     const {
//       name,
//       description,
//       price,
//       category,
//       brand,
//       manufacturer,
//       packing,
//       strength,
//       usageApplication,
//       countryOfOrigin,
//       customFields,
//     } = req.body;

//     // ✅ Parse subCategories (array)
//     let subCategories = [];
//     if (req.body.subCategories) {
//       try {
//         subCategories = JSON.parse(req.body.subCategories);
//         console.log("🧩 Parsed Subcategories:", subCategories);
//       } catch (error) {
//         console.error("⚠️ Error parsing subCategories:", error);
//       }
//     }

//     // ✅ Parse custom fields if needed
//     let parsedCustomFields = [];
//     if (customFields) {
//       try {
//         parsedCustomFields = JSON.parse(customFields);
//       } catch {
//         parsedCustomFields = [];
//       }
//     }

//     // ✅ Handle uploaded image paths
//     const imagePaths = req.files?.map((file) => `/uploads/${file.filename}`) || [];

//     // ✅ Create and save new product
//     const newProduct = new productModel({
//       name,
//       description,
//       price,
//       category,
//       subCategories,
//       brand,
//       manufacturer,
//       packing,
//       strength,
//       usageApplication,
//       countryOfOrigin,
//       customFields: parsedCustomFields,
//       images: imagePaths,
//     });

//     await newProduct.save();

//     res.status(201).json({
//       success: true,
//       message: "✅ Product added successfully",
//       product: newProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error in addProduct:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };
// // ✅ UPDATE PRODUCT (Deletes old images if replaced)
// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const {
//       name,
//       description,
//       price,
//       category,
//       subCategories,
//       brand,
//       manufacturer,
//       packing,
//       strength,
//       usageApplication,
//       countryOfOrigin,
//       customFields,
//     } = req.body;

//     // ✅ Parse subcategories safely
//     let parsedSubCategories = [];
//     if (subCategories) {
//       try {
//         parsedSubCategories = JSON.parse(subCategories);
//       } catch {
//         parsedSubCategories = Array.isArray(subCategories)
//           ? subCategories
//           : [subCategories];
//       }
//     }

//     // ✅ Parse custom fields safely
//     let parsedCustomFields = [];
//     if (customFields) {
//       try {
//         parsedCustomFields = JSON.parse(customFields);
//       } catch {
//         parsedCustomFields = [];
//       }
//     }

//     // ✅ Find existing product
//     const existingProduct = await productModel.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }

//     let updatedImages = existingProduct.images;

//     // ✅ If new files uploaded → delete old ones
//     if (req.files && req.files.length > 0) {
//       // Delete old image files safely
//       existingProduct.images.forEach((imgPath) => {
//         const fullPath = path.join(__dirname, "..", imgPath);
//         if (fs.existsSync(fullPath)) {
//           try {
//             fs.unlinkSync(fullPath);
//             console.log(`🗑️ Deleted old image: ${fullPath}`);
//           } catch (err) {
//             console.warn(`⚠️ Failed to delete ${fullPath}:`, err.message);
//           }
//         }
//       });

//       // Add new images
//       updatedImages = req.files.map((file) => `/uploads/${file.filename}`);
//     }

//     const updateData = {
//       name,
//       description,
//       price,
//       category,
//       subCategories: parsedSubCategories,
//       brand: brand || "",
//       manufacturer: manufacturer || "",
//       packing: packing || "",
//       strength: strength || "",
//       usageApplication: usageApplication || "",
//       countryOfOrigin: countryOfOrigin || "",
//       customFields: parsedCustomFields,
//       images: updatedImages,
//     };

//     const updatedProduct = await productModel
//       .findByIdAndUpdate(id, updateData, { new: true })
//       .populate("category subCategories");

//     res.json({
//       success: true,
//       message: "✅ Product updated successfully (old images removed if replaced)",
//       product: updatedProduct,
//     });
//   } catch (error) {
//     console.error("❌ Error updating product:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const listProducts = async (req, res) => {
//   try {
//     const { category, subCategory } = req.query;
//     const filter = {};

//     // ✅ Only filter when category is an actual Mongo ID
//     if (category && category !== "All") {
//       filter.category = new mongoose.Types.ObjectId(category);
//     }

//     // ✅ Subcategory filter
//     if (subCategory) {
//       filter.subCategories = { $in: [new mongoose.Types.ObjectId(subCategory)] };
//     }

//     const products = await productModel
//       .find(filter)
//       .populate("category subCategories");

//     res.json({ success: true, products });
//   } catch (error) {
//     console.error("❌ Error listing products:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };