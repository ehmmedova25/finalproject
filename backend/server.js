import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from "./routes/recipeRoutes.js";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

app.use('/api', authRoutes);
app.use("/api/recipes", recipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server işə düşdü: ${PORT}`));
