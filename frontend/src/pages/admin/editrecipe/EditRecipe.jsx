import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateRecipe } from "../../../redux/reducers/recipeSlice";
import { toast } from "react-toastify";
import axios from "axios";
import styles from "./EditRecipe.module.css";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Resept yüklənmədi");
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...recipe.steps];
    updatedSteps[index][field] = value;
    setRecipe({ ...recipe, steps: updatedSteps });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateRecipe({ id, updatedData: {
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps
      }})).unwrap();

      toast.success("Resept yeniləndi!");
navigate("/dashboard/admin/my-recipes");

    } catch (err) {
      toast.error("Yeniləmə zamanı xəta baş verdi");
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (!recipe) return <p>Resept tapılmadı</p>;

  return (
    <div className={styles.wrapper}>
      <h2>Resepti Redaktə Et</h2>
      <form onSubmit={handleUpdate} className={styles.form}>
        <label>Başlıq</label>
        <input
          type="text"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          required
        />

        <label>Tərkiblər</label>
        {recipe.ingredients.map((ing, i) => (
          <div key={i} className={styles.inline}>
            <input
              type="text"
              value={ing}
              onChange={(e) => {
                const newIngredients = [...recipe.ingredients];
                newIngredients[i] = e.target.value;
                setRecipe({ ...recipe, ingredients: newIngredients });
              }}
              required
            />
            <button
              type="button"
              onClick={() =>
                setRecipe({
                  ...recipe,
                  ingredients: recipe.ingredients.filter((_, idx) => idx !== i),
                })
              }
            >
              Sil
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] })}>
          Tərkib əlavə et
        </button>

        <label>Addımlar</label>
        {recipe.steps.map((step, i) => (
          <div key={i} className={styles.inline}>
            <input
              type="text"
              placeholder="Mətn"
              value={step.text}
              onChange={(e) => handleStepChange(i, "text", e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Vaxt"
              value={step.timer}
              onChange={(e) => handleStepChange(i, "timer", e.target.value)}
            />
            <button
              type="button"
              onClick={() =>
                setRecipe({
                  ...recipe,
                  steps: recipe.steps.filter((_, idx) => idx !== i),
                })
              }
            >
              Sil
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setRecipe({
              ...recipe,
              steps: [...recipe.steps, { text: "", timer: "", videoUrl: "" }],
            })
          }
        >
          Addım əlavə et
        </button>

        <button type="submit" className={styles.submit}>Yadda saxla</button>
      </form>
    </div>
  );
};

export default EditRecipe;
