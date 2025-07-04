import mongoose from "mongoose";
import Recipe from "../models/Recipe.js";
export const createRecipe = async (req, res) => {
  try {
    const { title, image, videoUrl, ingredients, steps, category } = req.body;

    const parsedIngredients = JSON.parse(ingredients);
    const parsedSteps = JSON.parse(steps);

    const newRecipe = new Recipe({
      title,
      image,
      videoUrl,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      createdBy: req.user.id,
      category, 
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    console.error("Resept əlavə xəta:", error.message);
    res.status(500).json({ message: "Resept əlavə olunarkən xəta baş verdi." });
  }
};





export const getAllRecipes = async (req, res) => {
  try {
    const { search = "", category = "All" } = req.query;

    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

   if (category && category !== "All") {
  if (mongoose.Types.ObjectId.isValid(category)) {
    filter.category = category;
  } else {
    return res.status(400).json({ message: "Yanlış kateqoriya ID-si" });
  }
}
    console.log("🟢 filter:", filter);

    const recipes = await Recipe.find(filter).populate("category", "name");
    res.status(200).json(recipes);
  } catch (err) {
    console.error("❌ getAllRecipes ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
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

export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    if (!recipe) return res.status(404).json({ message: "Resept tapılmadı" });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Resept yüklənə bilmədi" });
  }
};

export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Resept tapılmadı!" });
    }

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu resepti silməyə icazəniz yoxdur!" });
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Resept silindi!" });
  } catch (error) {
    console.error("Silinmə zamanı xəta:", error.message);
    res.status(500).json({ message: "Server xətası" });
  }
};

export const updateRecipe = async (req, res) => {
  try {
    const { title, ingredients, steps } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Resept tapılmadı" });

    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bu resepti redaktə etməyə icazəniz yoxdur!" });
    }

    recipe.title = title || recipe.title;
    recipe.ingredients = ingredients || recipe.ingredients;
    recipe.steps = steps || recipe.steps;

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error("Update xəta:", error.message);
    res.status(500).json({ message: "Redaktə zamanı xəta baş verdi." });
  }
};

export const rateRecipe = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Resept tapılmadı" });
    }

    recipe.ratings.push({
      user: userId,
      rating: Number(rating),
      comment,
    });

    const total = recipe.ratings.reduce((acc, r) => acc + r.rating, 0);
    recipe.averageRating = (total / recipe.ratings.length).toFixed(1);

    await recipe.save();
    res.status(200).json(recipe);
  } catch (err) {
    console.error("Reytinq xətası:", err.message);
    res.status(500).json({ message: "Server xətası" });
  }
};

export const replyToRating = async (req, res) => {
  const { recipeId, ratingId } = req.params;
  const { comment } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const rating = recipe.ratings.id(ratingId);
    if (!rating) return res.status(404).json({ message: "Rating not found" });

    rating.replies.push({
      user: req.user.id,
      comment,
      createdAt: new Date(),
    });

    await recipe.save();

    const updatedRecipe = await Recipe.findById(recipeId)
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const likeRating = async (req, res) => {
  const { recipeId, ratingId } = req.params;
  const userId = req.user.id;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    const rating = recipe.ratings.id(ratingId);
    if (!rating) return res.status(404).json({ msg: "Rating not found" });

    const alreadyLiked = rating.likes.includes(userId);
    if (alreadyLiked) {
      rating.likes = rating.likes.filter((uid) => uid.toString() !== userId);
    } else {
      rating.dislikes = rating.dislikes.filter((uid) => uid.toString() !== userId);
      rating.likes.push(userId);
    }

    await recipe.save();

    const populatedRecipe = await Recipe.findById(recipeId)
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    res.status(200).json(populatedRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const dislikeRating = async (req, res) => {
  const { recipeId, ratingId } = req.params;
  const userId = req.user.id;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ msg: "Recipe not found" });

    const rating = recipe.ratings.id(ratingId);
    if (!rating) return res.status(404).json({ msg: "Rating not found" });

    const alreadyDisliked = rating.dislikes.includes(userId);
    if (alreadyDisliked) {
      rating.dislikes = rating.dislikes.filter((uid) => uid.toString() !== userId);
    } else {
      rating.likes = rating.likes.filter((uid) => uid.toString() !== userId);
      rating.dislikes.push(userId);
    }

    await recipe.save();

    const populatedRecipe = await Recipe.findById(recipeId)
      .populate("ratings.user", "firstName lastName")
      .populate("ratings.replies.user", "firstName lastName");

    res.status(200).json(populatedRecipe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUniqueCategories = async (req, res) => {
  try {
    const categories = await Recipe.distinct("category");
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Xəta baş verdi", error });
  }
};
