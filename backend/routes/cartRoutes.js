import express from "express";
import { addToCart, getCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cartController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);
router.put("/update/:productId", verifyToken, updateCartItem);
router.delete("/:productId", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);

export default router;
