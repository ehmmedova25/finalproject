import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from '../controllers/authController.js';

const router = express.Router();

// Register və Login
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh', refreshToken);

// 🔐 Google OAuth giriş — HƏMİŞƏ hesab seçmək üçün prompt əlavə etdik
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account', // 👈 bu hissə vacibdir!
}));

// 🔁 Google callback: Token yaradılır və redirect edilir
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const accessToken = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün
    });

    // 👇 Frontendə yönləndiririk (Vite üçün 5173 port)
    res.redirect(`http://localhost:3000/oauth-success?token=${accessToken}`);
  }
);

export default router;
