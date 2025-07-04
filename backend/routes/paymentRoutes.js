import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", verifyToken, createCheckoutSession);

export default router;
