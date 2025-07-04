import express from "express";
import multer from "multer";
import { storage } from "../utils/Cloudinary.js";
import { getAllBanners, createBanner, deleteBanner,updateBanner } from "../controllers/bannerController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const upload = multer({ storage });
const router = express.Router();

router.get("/", getAllBanners);
router.post("/", verifyToken, isAdmin, upload.single("image"), createBanner);
router.delete("/:id", verifyToken, isAdmin, deleteBanner);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updateBanner);
export default router;
