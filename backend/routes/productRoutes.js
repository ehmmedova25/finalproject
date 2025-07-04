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
} from "../controllers/productController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.get("/", getAllProducts);
router.get("/my", verifyToken, getMyProducts);
router.get("/locations", getUniqueLocations); 
router.get("/:id", getProductById);
router.post("/:id/rate", verifyToken, rateProduct);
router.delete("/:id", verifyToken, deleteProduct);
router.put("/:id", verifyToken, updateProduct);

export default router;
