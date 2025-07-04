import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});

export default mongoose.model("Location", locationSchema);
