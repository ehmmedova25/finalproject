import Restaurant from '../models/Restaurant.js';

export const createRestaurant = async (req, res) => {
  const { name, address, image, tags, coordinates } = req.body;

  if (!name || !address || !coordinates) {
    return res.status(400).json({ message: 'Zəhmət olmasa bütün sahələri doldurun' });
  }

  const restaurant = new Restaurant({
    name,
    address,
    image,
    tags,
    location: {
      type: 'Point',
      coordinates: coordinates
    }
  });

  await restaurant.save();
  res.status(201).json(restaurant);
};

export const getAllRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
};

export const getRestaurantById = async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) return res.status(404).json({ message: 'Restoran tapılmadı' });
  res.json(restaurant);
};
