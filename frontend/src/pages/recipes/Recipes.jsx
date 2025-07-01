import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../../redux/reducers/recipeSlice";
import styles from "./Recipes.module.css";
import { Link } from "react-router-dom";

const Recipes = () => {
  const dispatch = useDispatch();
  const { items: recipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes());
  }, [dispatch]);

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {error}</p>;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Bütün Reseptlər</h1>
      <div className={styles.grid}>
        {recipes.map((recipe) => (
          <div key={recipe._id} className={styles.card}>
            <img src={recipe.image} alt={recipe.title} />
            <h3>{recipe.title}</h3>
            <Link to={`/cook-mode/${recipe._id}`} className={styles.button}>Cook Mode</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipes;
