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

const router = express.Router();

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
