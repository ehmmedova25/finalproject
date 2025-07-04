import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { rateRecipe, addRating } from "../../redux/reducers/recipeSlice";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from './RatingForm.module.css';

const RatingForm = ({ recipeId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.warning("Zəhmət olmasa ulduz seçin!");

    setIsSubmitting(true);
    
    try {
      await dispatch(rateRecipe({ id: recipeId, rating, comment })).unwrap();

      toast.success("Rəyiniz əlavə olundu!");
      setRating(0);
      setComment("");
      setHoverRating(0);

      dispatch(addRating({ rating, comment }));
    } catch {
      toast.error("Xəta baş verdi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3>Reytinq verin</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer" }}
            >
              {star <= (hoverRating || rating) ? (
                <FaStar color="#d4af37" />
              ) : (
                <FaRegStar color="#e8e2d5" />
              )}
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Rəyinizi yazın..."
          required
          disabled={isSubmitting}
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Göndərilir..." : "Göndər"}
        </button>
      </form>
    </div>
  );
};

export default RatingForm;