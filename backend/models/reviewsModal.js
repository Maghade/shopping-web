
import mongoose from 'mongoose';
const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Ensure this is the correct model name
      required: true
    }
    ,    
    reviewerName: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    approved: { type: Boolean, default: false },  // <-- Add approval field
    createdAt: { type: Date, default: Date.now },
    rating: { type: Number, required: true },
        review: { type: String, required: true },
        date: { type: Date, default: Date.now },
  });
  const reviewModel = mongoose.models.review || mongoose.model("Review", reviewSchema);
export default reviewModel