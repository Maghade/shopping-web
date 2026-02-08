import mongoose from "mongoose";
const bundleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }],
    category: { type: String, required: true },
    coupons: [{ type: String }], // ✅ Fix here
  });
  

const bundleModel = mongoose.models.bundle || mongoose.model("Bundle", bundleSchema);
export default bundleModel;
