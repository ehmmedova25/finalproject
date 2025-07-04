import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, icon } = req.body;
    if (!name) return res.status(400).json({ message: "Kateqoriya adı tələb olunur" });

    const newCategory = new Category({ name, icon });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};


export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
