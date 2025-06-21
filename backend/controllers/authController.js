import User from '../models/User.js';
import crypto from 'crypto';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import sendVerificationEmail from '../utils/sendVerificationEmail.js';
import sendResetPasswordEmail from '../utils/sendResetPasswordEmail.js';
import { OAuth2Client } from 'google-auth-library';


export const registerUser = async (req, res) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    role: Joi.string().valid('user', 'seller'),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { firstName, lastName, username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res.status(400).json({ message: 'Email və ya istifadəçi adı artıq mövcuddur.' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 3600000);

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({ message: 'Qeydiyyat uğurludur. Zəhmət olmasa emailinizi təsdiqləyin.' });
  } catch (err) {
    res.status(500).json({ message: 'Server xətası', error: err.message });
  }
};

export const verifyUser = async (req, res) => {
  const { token } = req.params;
  console.log("Gələn token:", token);

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    console.log("Tapılan user:", user);

    if (!user) {
      return res.status(400).json({ message: 'Token etibarsız və ya vaxtı keçmişdir.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.redirect('http://localhost:5173/home');
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: 'Server xətası', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'İstifadəçi tapılmadı' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Şifrə yalnışdır' });

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Zəhmət olmasa emailinizi təsdiqləyin' });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server xətası', error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'İstifadəçi tapılmadı' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();
    await sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({ message: 'Şifrə sıfırlama linki emailinizə göndərildi' });
  } catch (err) {
    res.status(500).json({ message: 'Server xətası', error: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Token etibarsız və ya vaxtı keçmişdir.' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: 'Şifrə uğurla yeniləndi' });
  } catch (err) {
    res.status(500).json({ message: 'Server xətası', error: err.message });
  }
};


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, given_name, family_name, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        firstName: given_name,
        lastName: family_name,
        email,
        username: sub,
        isVerified: true,
        password: sub, 
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ token: jwtToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Google login xətası' });
  }
};
