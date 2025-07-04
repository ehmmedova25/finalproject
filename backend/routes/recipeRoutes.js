import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  createRecipe,
  getAllRecipes,
  getMyRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  rateRecipe,
  replyToRating,
  likeRating,
  dislikeRating,
  
} from "../controllers/recipeController.js";
import { getUniqueCategories } from "../controllers/recipeController.js";

import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/", verifyToken, upload.fields([]), createRecipe);
router.get("/", getAllRecipes);
router.get("/my", verifyToken, getMyRecipes);
router.get("/:id", getRecipeById);
router.put("/:id", verifyToken, updateRecipe);
router.delete("/:id", verifyToken, deleteRecipe);
router.post("/:id/rate", verifyToken, rateRecipe);
router.post("/:recipeId/rating/:ratingId/reply", verifyToken, replyToRating);
router.put("/:recipeId/rating/:ratingId/like", verifyToken, likeRating);
router.post("/:recipeId/rating/:ratingId/dislike", verifyToken, dislikeRating);
router.get("/categories", getUniqueCategories);

export default router;
