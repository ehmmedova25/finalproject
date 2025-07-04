import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

export default mongoose.model("Banner", bannerSchema);