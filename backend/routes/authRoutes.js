import express from 'express';
import { registerUser, verifyUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/google-login', googleLogin);


export default router;


