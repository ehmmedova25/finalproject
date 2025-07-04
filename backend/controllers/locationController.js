import Location from "../models/Location.js";

export const addLocation = async (req, res) => {
  const { value, label } = req.body;

  if (!value || !label) {
    return res.status(400).json({ message: "Zəhmət olmasa dəyər və label daxil edin." });
  }

  try {
    const existing = await Location.findOne({ value });
    if (existing) {
      return res.status(400).json({ message: "Bu lokasiya artıq mövcuddur." });
    }

    const newLocation = new Location({ value, label });
    await newLocation.save();

    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ message: "Lokasiya əlavə edilə bilmədi", error: error.message });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.status(200).json(locations);
  } catch (err) {
    res.status(500).json({ message: "Lokasiyalar yüklənə bilmədi", error: err.message });
  }
};
