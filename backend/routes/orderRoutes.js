import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
getOrdersForSeller
  
} from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);

router.get("/my", verifyToken, getMyOrders);

router.get("/all", verifyToken, isAdmin, getAllOrders);

router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);

router.get("/seller", verifyToken, getOrdersForSeller);

export default router;
