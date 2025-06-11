import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/profile', verifyToken, async (req, res) => {
  const user = await User.findById(req.user).select('-password');
  if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı.' });
  res.json(user);
});

export default router;
