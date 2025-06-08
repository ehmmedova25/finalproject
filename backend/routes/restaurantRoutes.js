import express from 'express';
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById
} from '../controllers/restaurantController.js';

const router = express.Router();

router.post('/', createRestaurant);
router.get('/', getAllRestaurants); 
router.get('/:id', getRestaurantById); 

export default router;
