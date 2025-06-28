// backend/routes/recipeRoutes.js
import express from "express";
import { createRecipe, getAllRecipes, getRecipeById } from "../controllers/recipeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Multer ilə 2 fayl yüklənə bilər: image və video
router.post("/", verifyToken, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), createRecipe);

router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);

export default router;
