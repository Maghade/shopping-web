import RequestModel from "../models/requestModel.js";


export const listOrders = async (req, res) => {
  try {
    console.log("✅ User ID from token:", req.userId);

    // ✅ Fetch Orders
    const orders = await RequestModel.find({ user: req.userId }).lean();

    // ✅ Fetch Requests
    const requests = await RequestModel.find({ userId: req.userId })
      .populate("productId", "name") // optional: populate product name
      .lean();

    // ✅ Add type field for frontend table identification
    const formattedOrders = orders.map((o) => ({
      ...o,
      type: "Order",
      productName: o.items?.[0]?.ProductName || "—",
      date: o.date,
    }));

    const formattedRequests = requests.map((r) => ({
      ...r,
      type: "Request",
      productName: r.productId?.name || "—",
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

    const order = await RequestModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order/Request not found",
      });
    }

    await RequestModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "✅ Order/Request removed successfully",
    });

  } catch (error) {
    console.error("❌ Error removing order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove"
    });
  }
};




export const adminListOrders = async (req, res) => {
  try {
    const orders = await RequestModel.find()
      .populate("userId", "name email")   // ✅ add email
      .populate("productId", "name image images img")
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


