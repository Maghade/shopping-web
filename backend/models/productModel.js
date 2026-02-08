





import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    description: { type: String },
    images: [{ type: String }],
    size: { type: String },

    // 🧠 Additional info fields
    brand: { type: String },
    manufacturer: { type: String },
    packing: { type: String },
    strength: { type: String },
    usageApplication: { type: String },
    countryOfOrigin: { type: String },

    // 🏷️ Category + Subcategory relations
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],

    // 💬 Dynamic custom fields (array of key-value)
    customFields: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);