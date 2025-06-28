import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./Recipes.module.css";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
const res = await axios.get("http://localhost:5000/api/recipes");
        setRecipes(res.data);
      } catch (err) {
        console.error("Reseptlər yüklənmədi", err);
      }
    };
    fetchRecipes();
  }, []);

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
