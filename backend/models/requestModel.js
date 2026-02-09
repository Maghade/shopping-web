import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    images: [{ type: String }],
    email: {
      type: String,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("Request", requestSchema);
export default RequestModel;
