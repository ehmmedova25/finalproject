import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPrice: Number,
  images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  location: [{ value: String, label: String }],
  ingredients: [String],
  stock: Number,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  ratings: [
    {
      user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
      rating: { type: Number, required: true },
      comment: { type: String, required: true }, 
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      replies: [
        {
          user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
          },
          comment: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      createdAt: { type: Date, default: Date.now },
    },
  ],

  averageRating: {
    type: Number,
    default: 0
  },

  measurements: {
    type: {
      type: String,
      enum: ["weight", "portion", "both"],
    },
    totalWeightGr: Number,
    weightKg: Number,
    weightGr: Number,
    totalPortions: Number,
    gramsPerPortion: Number,
  },

  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);
export default Product;