import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  location: [{ value: String, label: String }],
  ingredients: [String],
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      comment: String,
    },
  ],
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ Modeli yarat və default export et
const Product = mongoose.model("Product", productSchema);
export default Product;
