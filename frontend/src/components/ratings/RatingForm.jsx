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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(rateRecipe({ id: recipeId, rating, comment })).unwrap();

      toast.success("Reytinq əlavə olundu!");
      setRating(0);
      setComment("");

      dispatch(addRating({ rating, comment }));
    } catch {
      toast.error("Xəta baş verdi!");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h3>Reytinq ver</h3>
      <form onSubmit={handleSubmit}>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              style={{ cursor: "pointer", fontSize: 24 }}
            >
              {star <= (hoverRating || rating) ? <FaStar color="gold" /> : <FaRegStar color="gray" />}
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Şərhinizi yazın..."
          required
        />
        <button type="submit">Göndər</button>
      </form>
    </div>
  );
};

export default RatingForm;
