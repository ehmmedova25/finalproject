import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  image: { type: String }, 
  createdAt: { type: Date, default: Date.now },
});


const Category = mongoose.model("Category", categorySchema);
export default Category;
