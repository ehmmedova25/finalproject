import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyRecipes, deleteRecipe } from "../../redux/reducers/recipeSlice";
import { Link, useNavigate } from "react-router-dom";
import styles from "./MyRecipes.module.css";
import { toast } from "react-toastify";

const MyRecipes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: recipes, loading, error } = useSelector((state) => state.recipes);

  useEffect(() => {
    dispatch(fetchMyRecipes());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Bu resepti silmək istədiyinizə əminsiniz?");
    if (!confirmDelete) return;

    try {
      await dispatch(deleteRecipe(id)).unwrap();
      toast.success("Resept silindi");
    } catch (err) {
      console.error("Silinərkən xəta:", err.message);
      toast.error("Silinərkən xəta baş verdi");
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
