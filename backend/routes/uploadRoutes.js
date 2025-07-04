import express from "express";
import upload from "../middleware/upload.js";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Zəhmət olmasa şəkil faylı seçin." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories", 
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error("🔥 Cloudinary upload error:", error.message);
    res.status(500).json({ message: "Şəkil yükləmə uğursuz oldu." });
  }
});

export default router;
