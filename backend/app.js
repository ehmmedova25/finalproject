 
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/restaurants', restaurantRoutes);
// Routes
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
  res.send('🌐 API is running...');
});

export default app;

