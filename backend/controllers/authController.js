import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/sendVerificationEmail.js'; 

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email artıq qeydiyyatdan keçib.' });

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({ name, email, password, verificationToken });
    await user.save();

    await sendVerificationEmail(user.email, verificationToken); 

    res.status(201).json({
      message: 'Qeydiyyat uğurludur. Zəhmət olmasa emailinizi yoxlayın.'
    });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ message: err.message });
  }
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Email və ya şifrə yanlışdır.' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      accessToken
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: err.message });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Çıxış edildi.' });
};

export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'Token yoxdur.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error('Refresh error:', err.message);
    res.status(403).json({ message: 'Token etibarsızdır.' });
  }
};
