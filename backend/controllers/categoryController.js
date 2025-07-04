import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { name, icon, image } = req.body;
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({ message: "Kateqoriya adı tələb olunur" });
    }

    const existing = await Category.findOne({ name: trimmedName });
    if (existing) {
      return res.status(409).json({ message: "Bu adda kateqoriya artıq mövcuddur" });
    }

    const newCategory = new Category({
      name: trimmedName,
      icon,
      image,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("🔥 CREATE CATEGORY ERROR:", error.message);
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    console.error("🔥 GET CATEGORIES ERROR:", err.message);
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Kateqoriya uğurla silindi" });
  } catch (error) {
    console.error("🔥 DELETE CATEGORY ERROR:", error.message);
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, image } = req.body;
    
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }

    if (name && name.trim() !== category.name) {
      const trimmedName = name.trim();
      const existing = await Category.findOne({ name: trimmedName });
      if (existing) {
        return res.status(409).json({ message: "Bu adda kateqoriya artıq mövcuddur" });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name?.trim() || category.name,
        icon: icon !== undefined ? icon : category.icon,
        image: image !== undefined ? image : category.image,
      },
      { new: true }
    );

    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("🔥 UPDATE CATEGORY ERROR:", error.message);
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ message: "Kateqoriya tapılmadı" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("🔥 GET CATEGORY BY ID ERROR:", error.message);
    res.status(500).json({ message: "Server xətası", error: error.message });
  }
};