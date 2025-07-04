import User from "../models/User.js";
import crypto from "crypto";
import Joi from "joi";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";
import sendResetPasswordEmail from "../utils/sendResetPasswordEmail.js";
import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 Qeydiyyat
export const registerUser = async (req, res) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
    role: Joi.string().valid("user", "seller"),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { firstName, lastName, username, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email və ya istifadəçi adı artıq mövcuddur." });

    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password,
      role,
      isVerified: false,
    });

    await user.save();
    res
      .status(201)
      .json({ message: "Qeydiyyat uğurludur. Zəhmət olmasa daxil olun." });
  } catch (err) {
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};

// ✉️ Email doğrulama
export const verifyUser = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token etibarsız və ya vaxtı keçib." });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return res.status(200).json({ message: "Email təsdiqləndi!" });
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
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
    if (!user) return res.status(400).json({ message: "İstifadəçi tapılmadı" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Şifrə yalnışdır" });

    if (!user.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      user.verificationToken = verificationToken;
      user.verificationTokenExpires = new Date(Date.now() + 3600000);
      await user.save();
      await sendVerificationEmail(user.email, verificationToken);
      return res.status(403).json({ message: "Zəhmət olmasa emailinizi təsdiqləyin" });
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
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Daxil oldunuz",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};

// 🔁 Forgot Password
export const forgotPassword = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "İstifadəçi tapılmadı" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);
    res.status(200).json({ message: "Şifrə sıfırlama linki göndərildi" });
  } catch (err) {
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};

// 🔁 Reset Password
export const resetPassword = async (req, res) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Token etibarsız və ya vaxtı keçmişdir." });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Şifrə uğurla yeniləndi" });
  } catch (err) {
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        firstName: name,
        lastName: "",
        username: email.split("@")[0],
        email,
        password: googleId,
        isVerified: true,
        role: "user",
      });
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
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Google ilə giriş uğursuz oldu", error: error.message });
  }
};

// ❤️ Toggle Favorite
export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.id;

    const index = user.favorites.findIndex((id) => id.equals(recipeId));
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    res.status(200).json({
      message: "Favorilər yeniləndi",
      favorites: user.favorites.map((id) => id.toString()),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Favori dəyişdirilə bilmədi", error: err.message });
  }
};

// 🍳 Toggle To-Cook
export const toggleToCook = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.id;

    const index = user.toCookList.findIndex((id) => id.equals(recipeId));
    if (index > -1) {
      user.toCookList.splice(index, 1);
    } else {
      user.toCookList.push(recipeId);
    }

    await user.save();
    res.status(200).json({
      message: "To-Cook siyahısı yeniləndi",
      toCookList: user.toCookList.map((id) => id.toString()),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "To-Cook dəyişdirilə bilmədi", error: err.message });
  }
};

// 📥 Get Favorites
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.status(200).json(user.favorites);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Favoritləri almaqda xəta", error: err.message });
  }
};

// 📥 Get To-Cook List
export const getToCookList = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("toCookList");
    res.status(200).json(user.toCookList);
  } catch (err) {
    res
      .status(500)
      .json({ message: "To-Cook siyahısı almaqda xəta", error: err.message });
  }
};
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Bütün sahələr tələb olunur" });
  }

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await user.matchPassword(oldPassword);

    if (!isMatch) {
      return res.status(400).json({ message: "Köhnə parol yanlışdır" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Parol uğurla dəyişdirildi" });
  } catch (err) {
    res.status(500).json({ message: "Server xətası" });
  }
};
