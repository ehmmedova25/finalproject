// =====================================

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log("🔍 verifyToken - Token:", token ? "var" : "yox");
    
    if (!token) {
      console.log("❌ verifyToken - Token yoxdur");
      return res.status(401).json({ message: 'Token yoxdur, giriş icazəsi verilmir' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ verifyToken - Decoded:", decoded);
    
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log("❌ verifyToken - User tapılmadı");
      return res.status(401).json({ message: 'İstifadəçi tapılmadı' });
    }

    console.log("✅ verifyToken - User tapıldı:", { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    });
    
    req.user = user;
    next();
    
  } catch (err) {
    console.error("❌ verifyToken error:", err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token etibarsızdır' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token vaxtı bitib' });
    }
    res.status(401).json({ message: 'Token xətası' });
  }
};

export const isAdmin = (req, res, next) => {
  console.log("🔍 isAdmin - User role:", req.user?.role);
  
  if (req.user?.role !== 'admin') {
    console.log("❌ isAdmin - İcazə yoxdur");
    return res.status(403).json({ message: 'Admin icazəsi tələb olunur' });
  }
  
  console.log("✅ isAdmin - Admin icazəsi təsdiqləndi");
  next();
};
