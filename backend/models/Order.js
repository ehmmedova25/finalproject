import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    price: { 
      type: Number,
      required: true
    }
  }],
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    deliveryMethod: { type: String, enum: ["delivery", "pickup"], required: true }
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  stripeSessionId: String,
  orderDate: {
    type: Date,
    default: Date.now
  },
  deliveryDate: Date,
  notes: String
}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
