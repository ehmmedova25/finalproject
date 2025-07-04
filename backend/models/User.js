import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  toCookList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
  isBlocked: {
  type: Boolean,
  default: false
},
blockedAt: {
  type: Date,
  default: null
},
blockedReason: {
  type: String,
  default: ''
}
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
