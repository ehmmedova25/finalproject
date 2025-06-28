import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./CookMode.module.css";

const formatTime = (input) => {
  if (!input) return "";
  if (typeof input === "string") return input;
  const h = Math.floor(input / 3600);
  const m = Math.floor((input % 3600) / 60);
  const s = input % 60;
  return `${h > 0 ? `${h} saat ` : ""}${m > 0 ? `${m} dəq ` : ""}${s} san`;
};

const CookMode = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error("Resept yüklənmədi:", err);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Yüklənir...</p>;

  const step = recipe.steps[stepIndex];

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{recipe.title}</h1>

      {/* Ümumi resept şəkli */}
      {recipe.image && (
        <img
          src={recipe.image}
          alt="resept şəkli"
          className={styles.mainImage}
        />
      )}

      <div className={styles.stepCard}>
        <h3>{`Addım ${stepIndex + 1} / ${recipe.steps.length}`}</h3>
        <p className={styles.stepText}>{step.text}</p>

        {/* Addım videosu varsa */}
        {step.videoUrl && (
          <video controls className={styles.stepVideo}>
            <source src={step.videoUrl} type="video/mp4" />
            Brauzeriniz videonu dəstəkləmir.
          </video>
        )}

        {/* Timer varsa */}
        {step.timer && (
          <p className={styles.timer}>Vaxt: {formatTime(step.timer)}</p>
        )}
      </div>

      <div className={styles.buttons}>
        <button
          onClick={() => setStepIndex((i) => Math.max(i - 1, 0))}
          disabled={stepIndex === 0}
        >
          ⬅ Əvvəlki
        </button>
        <button
          onClick={() =>
            setStepIndex((i) => Math.min(i + 1, recipe.steps.length - 1))
          }
          disabled={stepIndex === recipe.steps.length - 1}
        >
          Növbəti ➡
        </button>
      </div>
    </div>
  );
};

export default CookMode;
