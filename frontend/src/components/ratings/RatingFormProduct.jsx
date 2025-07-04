import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rateProduct } from "../../redux/reducers/productSlice";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./RatingForm.module.css";

const RatingFormProduct = ({ productId }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.warning("Zəhmət olmasa ulduz seçin!");

    try {
      const result = await dispatch(rateProduct({ id: productId, rating, comment })).unwrap();

      const event = new CustomEvent("new-rating-added", {
        detail: {
          ...result.newRating,
          user: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      });
      window.dispatchEvent(event);

      toast.success("Rəyiniz əlavə olundu!");
      setRating(0);
      setComment("");
    } catch {
      toast.error("Xəta baş verdi!");
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
              style={{ cursor: "pointer", fontSize: 24 }}
            >
              {star <= (hoverRating || rating) ? (
                <FaStar color="gold" />
              ) : (
                <FaRegStar color="gray" />
              )}
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Rəy yazın..."
          required
        />
        <button type="submit">Göndər</button>
      </form>
    </div>
  );
};

export default RatingFormProduct;
