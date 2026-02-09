import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        ProductName: {
          type: String,
          required: true,
        },

        size: {
          type: String,   // ✅ THIS IS WHAT SHOWS IN YOUR TABLE
          required: true,
        },

        quantity: {
          type: Number,
         
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
    
    },

    address: {
      type: Object,
      
    },

    status: {
      type: String,
      default: "Order Placed",
    },

    paymentMethod: {
      type: String,
     
    },

    payment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);
export default OrderModel;