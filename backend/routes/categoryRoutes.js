import express from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createCategory);
router.get("/", getCategories);

export default router;
