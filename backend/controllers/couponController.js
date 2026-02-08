import Coupon from '../models/couponModel.js';

// Create Coupon
export const createCoupon = async (req, res) => {
  const { code, discount, expiryDate } = req.body;

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.json({ success: false, message: "Coupon code already exists!" });
    }

    const coupon = new Coupon({ code, discount, expiryDate });
    await coupon.save();

    res.json({ success: true, message: "Coupon created successfully!", coupon });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get All Coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json({ success: true, coupons });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete Coupon
export const deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.json({ success: false, message: "Coupon not found!" });
    }
    res.json({ success: true, message: "Coupon deleted successfully!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
