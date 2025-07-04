
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const existingAdmin = await User.findOne({ email: "admin@example.com" });

    if (existingAdmin) {
      console.log("🔁 Admin artıq mövcuddur.");
      return process.exit(0);
    }

    const admin = new User({
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      email: "admin@example.com",
      password: "supersecure987", 
      role: "admin",
      isVerified: true,
    });

    await admin.save();
    process.exit(0);
  } catch (err) {
    console.error("❌ Admin yaradılarkən xəta:", err);
    process.exit(1);
  }
};

createAdmin();
