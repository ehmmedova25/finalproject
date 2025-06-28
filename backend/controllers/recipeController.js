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

// Bütün reseptlər
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate(
      "createdBy",
      "firstName lastName"
    );
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Reseptləri gətirmək mümkün olmadı" });
  }
};

// Tək resept
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Tapılmadı" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Xəta baş verdi" });
  }
};
