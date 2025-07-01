import Recipe from "../models/Recipe.js";

export const createRecipe = async (req, res) => {
  try {
    const { title, image, video } = req.body;
    const ingredients = JSON.parse(req.body.ingredients);
    const steps = JSON.parse(req.body.steps);

    const recipe = new Recipe({
      title,
      image,
      video,
      ingredients,
      steps,
      createdBy: req.user.id,
    });

    await recipe.save();
    res.status(201).json({ message: "Resept əlavə olundu", recipe });
  } catch (err) {
    console.error("Resept əlavə xəta:", err.message);
    res.status(500).json({ message: "Server xətası", error: err.message });
  }
};

export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "firstName lastName");
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Reseptləri gətirmək mümkün olmadı" });
  }
};

export const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.user.id });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Reseptləri gətirə bilmədik" });
  }
};


// backend/controllers/recipeController.js

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resept tapılmadı" });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Resept yüklənə bilmədi" });
  }
};
export const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resept tapılmadı" });

    if (recipe.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "İcazə yoxdur" });

    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.steps = steps;

    await recipe.save();
    res.json({ message: "Resept yeniləndi", recipe });
  } catch (error) {
    res.status(500).json({ message: "Redaktə zamanı xəta", error: error.message });
  }
};


export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resept tapılmadı" });

    console.log("Login olmuş user:", req.user.id);
    console.log("Resepti yazan user:", recipe.createdBy);

    if (recipe.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "İcazə yoxdur" });

    await recipe.remove();
    res.json({ message: "Resept silindi" });
  } catch (error) {
    res.status(500).json({ message: "Silinmə zamanı xəta", error: error.message });
  }
};
