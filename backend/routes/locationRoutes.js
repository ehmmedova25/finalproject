import express from "express";
import { addLocation, getAllLocations } from "../controllers/locationController.js";
import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllLocations);

router.post("/", verifyToken, isAdmin, addLocation);

export default router;
