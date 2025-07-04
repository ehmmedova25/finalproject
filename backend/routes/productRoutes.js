
import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  rateProduct,
  getMyProducts,
  deleteProduct,
  updateProduct,
  getUniqueLocations,
  getBestSellers,
  getBestSellersHome,
  getProductsByCategory, 
  getSimilarProducts,
  likeProductRating,
  dislikeProductRating,
  replyToProductRating,
} from "../controllers/productController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import multer from "multer";
const upload = multer();
const router = express.Router();

router.post("/", verifyToken, upload.none(), createProduct);
router.get("/", getAllProducts);
router.get("/my", verifyToken, getMyProducts);
router.get("/locations", getUniqueLocations); 
router.get("/best-sellers", getBestSellers);
router.get("/best-sellers-home", getBestSellersHome);
router.get("/category/:categoryName", getProductsByCategory);
router.get("/similar/:id", getSimilarProducts);

router.post("/:id/rate", verifyToken, rateProduct);
router.put("/:productId/rating/:ratingId/like", verifyToken, likeProductRating);
router.put("/:productId/rating/:ratingId/dislike", verifyToken, dislikeProductRating);
router.post("/:productId/rating/:ratingId/reply", verifyToken, replyToProductRating);

router.get("/:id", getProductById);
router.delete("/:id", verifyToken, deleteProduct);
router.put("/:id", verifyToken, upload.none(), updateProduct);

export default router;

