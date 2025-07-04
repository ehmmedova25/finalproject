import express from 'express';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Recipe from '../models/Recipe.js';
import Order from '../models/Order.js';
import { getAdminStats } from "../controllers/adminController.js";

const router = express.Router();

router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error("GET /admin/users error:", err);
    res.status(500).json({ message: 'İstifadəçilər tapılmadı' });
  }
});

router.delete('/user/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı' });
    }
    res.json({ message: 'İstifadəçi silindi' });
  } catch (err) {
    console.error("DELETE /admin/user error:", err);
    res.status(500).json({ message: 'Silinmə zamanı xəta baş verdi' });
  }
});

router.get('/products', verifyToken, isAdmin, async (req, res) => {
  try {
    const products = await Product.find().populate('user category');
    res.status(200).json(products);
  } catch (err) {
    console.error("GET /admin/products error:", err);
    res.status(500).json({ message: 'Məhsullar tapılmadı' });
  }
});

router.delete('/product/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Məhsul tapılmadı' });
    }
    res.json({ message: 'Məhsul silindi' });
  } catch (err) {
    console.error("DELETE /admin/product error:", err);
    res.status(500).json({ message: 'Silinmə zamanı xəta baş verdi' });
  }
});

router.get('/recipes', verifyToken, isAdmin, async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('user');
    res.status(200).json(recipes);
  } catch (err) {
    console.error("GET /admin/recipes error:", err);
    res.status(500).json({ message: 'Reseptlər tapılmadı' });
  }
});

router.delete('/recipe/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Resept tapılmadı' });
    }
    res.json({ message: 'Resept silindi' });
  } catch (err) {
    console.error("DELETE /admin/recipe error:", err);
    res.status(500).json({ message: 'Silinmə zamanı xəta baş verdi' });
  }
});

router.get('/orders', verifyToken, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customerInfo.userId', 'firstName lastName email')
      .populate('items.productId', 'name price');
    res.status(200).json(orders);
  } catch (err) {
    console.error("GET /admin/orders error:", err);
    res.status(500).json({ message: 'Sifarişlər tapılmadı' });
  }
});

router.get("/stats", verifyToken, isAdmin, getAdminStats);

export default router;
