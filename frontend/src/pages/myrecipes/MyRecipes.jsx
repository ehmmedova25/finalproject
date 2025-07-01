// frontend/src/pages/myrecipes/MyRecipes.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyRecipes } from "../../redux/reducers/recipeSlice";
import { Link, useNavigate } from "react-router-dom";
import styles from "./MyRecipes.module.css";
import axios from "axios";
import { toast } from "react-toastify";

const MyRecipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: recipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchMyRecipes());
  }, [dispatch]);
const handleDelete = async (id) => {
  const confirm = window.confirm("Bu resepti silmək istədiyinizə əminsiniz?");
  if (!confirm) return;

  const token = localStorage.getItem("token");

  try {
    await axios({
      method: "delete",
      url: `http://localhost:5000/api/recipes/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Resept silindi");
    dispatch(fetchMyRecipes());
  } catch (err) {
    console.error("Silinərkən xəta:", err.message);
    if (err.response?.data?.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Silinərkən xəta baş verdi");
    }
  }
};

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {error}</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Mənim Reseptlərim</h2>
      <div className={styles.grid}>
        {recipes.map((recipe) => (
          <div key={recipe._id} className={styles.card}>
            <img src={recipe.image} alt={recipe.title} />
            <h3>{recipe.title}</h3>
            <div className={styles.actions}>
              <button onClick={() => navigate(`/edit-recipe/${recipe._id}`)}>Redaktə</button>
              <button onClick={() => handleDelete(recipe._id)}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecipes;
