
// import mongoose from "mongoose";

// const subSubCategorySchema = new mongoose.Schema(
//   { name: { type: String, required: true } },
//   { timestamps: true }
// );

// const subCategorySchema = new mongoose.Schema(
//   {
//    type: [String], required: true,
 
//     category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
//   },
//   { timestamps: true }
// );

// const categorySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//         images: [{ type: String }],

//     subcategories: [
//       { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
//     ],
//   },
  
//   { timestamps: true }
// );

// export const SubSubCategory = mongoose.model(
//   "SubSubCategory",
//   subSubCategorySchema
// );
// export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
// export const Category = mongoose.model("Category", categorySchema);



import mongoose from "mongoose";

// Sub-Sub-Category Schema
const subSubCategorySchema = new mongoose.Schema(
  { 
    name: { type: String, required: true } 
  },
  { timestamps: true }
);

// Subcategory Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // ✅ Correct field definition
    subSubCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubSubCategory" },
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true }
);

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: [{ type: String }],
    subcategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
  },
  { timestamps: true }
);

// Export models
export const SubSubCategory = mongoose.model("SubSubCategory", subSubCategorySchema);
export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export const Category = mongoose.model("Category", categorySchema);
