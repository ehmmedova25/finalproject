// backend/routes/recipeRoutes.js
import express from "express";
import {
  createRecipe,
  getAllRecipes,
  getMyRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} from "../controllers/recipeController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();
// Sadəcə login olmuş istifadəçilər əlavə edə bilsin:
router.post(
  "/",
  verifyToken, // ← bu vacibdir!
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createRecipe
);

router.get("/mine", verifyToken, getMyRecipes); // Mənim reseptlərim
router.get("/", getAllRecipes);                 // Bütün reseptlər
router.get("/:id", getRecipeById);              // Tək resept
router.put("/:id", verifyToken, updateRecipe);  // Yenilə
router.delete("/:id", verifyToken, deleteRecipe); // Sil

export default router;
