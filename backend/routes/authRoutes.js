import express from 'express';
import {
  registerUser,
  loginUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  googleLogin,
  changePassword,
  toggleFavorite,
  toggleToCook,
  getFavorites,
  getToCookList,
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import User from "../models/User.js";

const router = express.Router();

router.get('/me', verifyToken, async (req, res) => {
  try {
    console.log("🔍 /me endpoint - req.user:", req.user);
        const user = req.user;

    
    if (!user) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }
        const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      favorites: user.favorites,
      toCookList: user.toCookList
    };
    
    console.log("✅ /me endpoint - User response:", userResponse);
    res.status(200).json(userResponse);
    
  } catch (err) {
    console.error("❌ /me endpoint error:", err);
    res.status(500).json({ message: 'İstifadəçi məlumatı yüklənə bilmədi' });
  }
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:token', verifyUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google-login', googleLogin);
router.post('/change-password', verifyToken, changePassword);
router.post('/favorites/:id', verifyToken, toggleFavorite);
router.post('/to-cook/:id', verifyToken, toggleToCook);
router.get('/favorites', verifyToken, getFavorites);
router.get('/to-cook', verifyToken, getToCookList);

export default router;