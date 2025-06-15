import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Yanlış və ya vaxtı keçmiş doğrulama linki.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email uğurla təsdiqləndi.' });
  } catch (err) {
    console.error('Verify error:', err.message);
    res.status(500).json({ message: 'Server xətası.' });
  }
});

export default router;
