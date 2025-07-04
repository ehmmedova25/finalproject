import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../../redux/reducers/recipeSlice";
import {
  toggleFavorite,
  toggleToCook,
  fetchFavorites,
  fetchToCookList,
} from "../../redux/reducers/userSlice";
import RecipeCard from "../../components/RecipeCard/RecipeCard";
import RecipeFilters from "../../components/RecipeFilters/RecipeFilter"; 
import styles from "./Recipes.module.css";

const Recipes = () => {
  const dispatch = useDispatch();
  const { items: recipes, loading, error } = useSelector((state) => state.recipes);
  const { favorites, toCookList } = useSelector((state) => state.user);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    dispatch(fetchRecipes({ search, category }));
    dispatch(fetchFavorites());
    dispatch(fetchToCookList());
  }, [dispatch, search, category]);

  const handleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const handleToCook = (id) => {
    dispatch(toggleToCook(id));
  };

  const LoadingSkeleton = () => (
    <>
      {[...Array(8)].map((_, index) => (
        <div key={index} className={styles.skeleton}></div>
      ))}
    </>
  );

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>🍽️ Bütün Reseptlər</h1>

      <RecipeFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className={styles.grid}>
        {loading ? (
          <div className={styles.loading}>
            Yüklənir...
          </div>
        ) : error ? (
          <div className={styles.error}>
            Xəta: {error}
          </div>
        ) : recipes.length === 0 ? (
          <div className={styles.noResults}>
            Heç bir resept tapılmadı
          </div>
        ) : (
          recipes.map((recipe) => (
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

export default Recipes;