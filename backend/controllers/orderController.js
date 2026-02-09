
import OrderModel from "../models/orderModel.js";
import RequestModel from "../models/requestModel.js";
export const listOrders = async (req, res) => {
  try {
    console.log("✅ User ID from token:", req.userId);

    // 🛒 FETCH REAL ORDERS
    const orders = await OrderModel.find({ userId: req.userId }).lean();

    // 💬 FETCH PRODUCT INTEREST REQUESTS
    const requests = await RequestModel.find({ userId: req.userId })
      .populate("productId", "name")
      .lean();

    // FORMAT ORDERS
    const formattedOrders = orders.map((o) => ({
      _id: o._id,
      type: "Order",
      productName: o.items?.[0]?.ProductName || "—",
      size: o.items?.[0]?.size || "—",   // ✅ SIZE FROM ORDER
      date: o.createdAt,
    }));

    // FORMAT REQUESTS
    const formattedRequests = requests.map((r) => ({
      _id: r._id,
      type: "Request",
      productName: r.productId?.name || "—",
      size: r.size || "—",               // ✅ SIZE FROM REQUEST
      date: r.createdAt,
    }));

    res.json({
      success: true,
      orders: formattedOrders,
      requests: formattedRequests,
    });
  } catch (err) {
    console.error("❌ listOrders Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
export const removeOrder = async (req, res) => {
  try {
    const { id } = req.body;

    // Try deleting from Orders
    let deleted = await OrderModel.findByIdAndDelete(id);

    // If not found, try Requests
    if (!deleted) {
      deleted = await RequestModel.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Order/Request not found",
      });
    }

    res.json({
      success: true,
      message: "✅ Removed successfully",
    });
  } catch (error) {
    console.error("❌ Error removing:", error);
    res.status(500).json({ success: false, message: "Failed to remove" });
  }
};



export const adminListOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const requests = await RequestModel.find()
      .populate("userId", "name email")
      .populate("productId", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      requests,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

