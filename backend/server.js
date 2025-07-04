import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import cartRoutes from './routes/cartRoutes.js';

import { v2 as cloudinary } from 'cloudinary';
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:5174',
}));

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server işləyir: ${PORT}`));
