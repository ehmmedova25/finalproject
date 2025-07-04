import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipes } from "../../redux/reducers/recipeSlice";
import {
  toggleFavorite,
  toggleToCook,
  fetchFavorites,
  fetchToCookList,
} from "../../redux/reducers/userSlice";
import RecipeCard from "../RecipeCard/RecipeCard";
import styles from "./RecipePreview.module.css";

const RecipePreview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: recipes, loading, error } = useSelector((state) => state.recipes);
  const { favorites, toCookList } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchRecipes({ search: "", category: "All" }));
    dispatch(fetchFavorites());
    dispatch(fetchToCookList());
  }, [dispatch]);

  const handleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const handleToCook = (id) => {
    dispatch(toggleToCook(id));
  };

  const handleViewAll = () => {
    navigate("/recipes");
  };

  const LoadingSkeleton = () => (
    <>
      {[...Array(4)].map((_, index) => (
        <div key={index} className={styles.skeleton}></div>
      ))}
    </>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>🍽️ Reseptlər</h2>
        <button className={styles.viewAllBtn} onClick={handleViewAll}>
          Hamısına bax
        </button>
      </div>

      <div className={styles.grid}>
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className={styles.error}>
            Xəta: {error}
          </div>
        ) : recipes.length === 0 ? (
          <div className={styles.noResults}>
            Heç bir resept tapılmadı
          </div>
        ) : (
          recipes.slice(0, 4).map((recipe) => (
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

export default RecipePreview;
