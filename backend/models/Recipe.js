import mongoose from "mongoose";

const stepSchema = new mongoose.Schema({
  text: { type: String, required: true },
  timer: { type: String, default: "" },
  videoUrl: { type: String, default: "" },
});

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now },
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  steps: [stepSchema],
  videoUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // ✅ Yalnız bir dəfə category
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: false },

  ratings: [ratingSchema],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
