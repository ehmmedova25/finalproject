import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRecipeById } from "../../redux/reducers/recipeSlice";
import styles from "./CookMode.module.css";
import StepCard from "../../components/stepcard/StepCard";
import StepNavigator from "../../components/stepnavigator/StepNavigator";
import RatingForm from "../../components/ratings/RatingForm";
import RatingList from "../../components/ratings/RatingList";

const CookMode = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const { selectedRecipe: recipe, loading } = useSelector((state) => state.recipes);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getRecipeById(id));
  }, [dispatch, id]);

  if (loading || !recipe) return <p>Yüklənir...</p>;

  const step = recipe.steps[stepIndex];

  if (!isAuthenticated && stepIndex > 1) {
    return (
      <div className={styles.wrapper}>
        <h2 className={styles.lockTitle}>Davam etmək üçün daxil olun</h2>
        <p className={styles.lockText}>Reseptin bütün addımlarına baxmaq üçün hesabınıza daxil olun.</p>
        <button className={styles.loginButton} onClick={() => navigate("/login")}>
          Daxil Ol
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{recipe.title}</h1>

      {recipe.image && (
        <img src={recipe.image} alt="resept şəkli" className={styles.mainImage} />
      )}

      <StepCard step={step} stepIndex={stepIndex} totalSteps={recipe.steps.length} />
      <StepNavigator
        stepIndex={stepIndex}
        setStepIndex={setStepIndex}
        totalSteps={recipe.steps.length}
      />

      {isAuthenticated && (
        <>
          <RatingForm recipeId={id} />
          <RatingList ratings={recipe.ratings} recipeId={recipe._id} />
        </>
      )}
    </div>
  );
};

export default CookMode;
