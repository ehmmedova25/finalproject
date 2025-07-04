import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavorites,
  toggleFavorite,
  toggleToCook,
  fetchToCookList,
} from "../../redux/reducers/userSlice";
import { fetchRecipes } from "../../redux/reducers/recipeSlice";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import styles from "./Favorites.module.css";

const Favorites = () => {
  const dispatch = useDispatch();
  const { items: recipes, loading: recipesLoading } = useSelector((state) => state.recipes);
  const {
    favorites,
    toCookList,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchRecipes());

    if (isAuthenticated) {
      dispatch(fetchFavorites());
      dispatch(fetchToCookList());
    }
  }, [dispatch, isAuthenticated]);

  const favoriteRecipes = recipes.filter((r) => favorites.includes(r._id));

  const handleFavorite = async (id) => {
    try {
      await dispatch(toggleFavorite(id));
    } catch (error) {
      console.error("Favorit dəyişdirilə bilmədi:", error);
    }
  };

  const handleToCook = async (id) => {
    try {
      await dispatch(toggleToCook(id));
    } catch (error) {
      console.error("ToCook dəyişdirilə bilmədi:", error);
    }
  };

  if (recipesLoading || userLoading) {
    return <div className={styles.loading}>Yüklənir...</div>;
  }

  if (userError) {
    return <div className={styles.error}>Səhv: {userError}</div>;
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Favori Reseptlərim</h1>

      <div className={styles.grid}>
        {favoriteRecipes.length === 0 ? (
          <p>Hələ favori reseptiniz yoxdur.</p>
        ) : (
          favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe._id)}
              isToCook={toCookList.includes(recipe._id)}
              onToggleFavorite={handleFavorite}
              onToggleToCook={handleToCook}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
