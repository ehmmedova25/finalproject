import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
],

  customerInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    note: { type: String },
  },
  status: {
    type: String,
    enum: ["pending", "processing", "delivered"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model("Order", orderSchema);
