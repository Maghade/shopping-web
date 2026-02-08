import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  cartData: { type: Object, default: {} },
  street: { type: String, },
  city: { type: String },
  state: { type: String },
  zipcode: { type: String },
  country: { type: String },
  mobile: { type: String },
  profileImage: { type: String },
  isVerified: { type: Boolean, default: false },
  verifyToken: { type: String },
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model('User', userSchema);

export default userModel