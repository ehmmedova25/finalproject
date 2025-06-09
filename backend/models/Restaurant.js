import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
});

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  menu: [dishSchema],
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
