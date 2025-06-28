import mongoose from "mongoose";

// backend/models/Recipe.js
const stepSchema = new mongoose.Schema({
  text: { type: String, required: true },
  timer: { type: String, default: "" },
  videoUrl: { type: String, default: "" }, // ✅ burada `required: false` və ya `default: ""` olmalıdır
});


const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  steps: [stepSchema],
  videoUrl: { type: String }, // Optional: video resept
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recipe", recipeSchema);
