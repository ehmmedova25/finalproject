import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchToCookList,
  toggleToCook,
  toggleFavorite,
  fetchFavorites,
} from "../../redux/reducers/userSlice";
import { fetchRecipes } from "../../redux/reducers/recipeSlice";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import styles from "./ToCookList.module.css";

const ToCookList = () => {
  const dispatch = useDispatch();
  const { items: recipes } = useSelector((state) => state.recipes);
  const { toCookList, favorites } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchRecipes());
    dispatch(fetchToCookList());
    dispatch(fetchFavorites());
  }, [dispatch]);

  const toCookRecipes = recipes.filter((r) => toCookList.includes(r._id));

  const handleToCook = (id) => {
    dispatch(toggleToCook(id));
  };

  const handleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Bişirəcəyim Reseptlər</h1>
      <div className={styles.grid}>
        {toCookRecipes.map((recipe) => (
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            isToCook={toCookList.includes(recipe._id)}
            isFavorite={favorites.includes(recipe._id)}
            onToggleToCook={handleToCook}
            onToggleFavorite={handleFavorite}
          />
        ))}
      </div>
    </div>
  );
};

export default ToCookList;
