import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rateProduct } from "../../redux/reducers/productSlice";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";
import styles from "./RatingForm.module.css";

const RatingFormProduct = ({ productId, onRatingAdded }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { loading } = useSelector((state) => state.products);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!rating) {
      toast.warning("Zəhmət olmasa ulduz seçin!");
      return;
    }
    
    if (!comment.trim()) {
      toast.warning("Rəy yazın!");
      return;
    }

    if (!productId) {
      toast.error("Məhsul ID tapılmadı!");
      return;
    }

    if (loading) return;
    
    try {
      console.log("Submitting rating:", { 
        productId, 
        rating: Number(rating), 
        comment: comment.trim() 
      });
      
      const result = await dispatch(rateProduct({ 
        id: productId, 
        rating: Number(rating), 
        comment: comment.trim() 
      })).unwrap();

      console.log("Rating submission result:", result);

      if (onRatingAdded && result.newRating) {
        onRatingAdded(result.newRating);
      }

      if (result.newRating) {
        const event = new CustomEvent("new-rating-added", {
          detail: result.newRating,
        });
        window.dispatchEvent(event);
      }

      toast.success("Rəyiniz əlavə olundu!");
      
      setRating(0);
      setComment("");
      setHoverRating(0);
      
    } catch (error) {
      console.error("Rating submission error:", error);
      
      if (typeof error === 'string') {
        toast.error(error);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Xəta baş verdi!");
      }
    }
  };

  if (!user) {
    return (
      <div className={styles.formContainer}>
        <p>Rəy yazmaq üçün daxil olun</p>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <h3>Reytinq verin</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={(e) => {
                e.preventDefault();
                setRating(star);
              }}
              style={{ 
                cursor: "pointer", 
                background: "none", 
                border: "none", 
                padding: "2px",
                fontSize: "20px"
              }}
              disabled={loading}
              aria-label={`${star} ulduz`}
            >
              {star <= (hoverRating || rating) ? (
                <FaStar color="#d4af37" />
              ) : (
                <FaRegStar color="#e8e2d5" />
              )}
            </button>
          ))}
        </div>
        
        <div className={styles.inputGroup}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Rəyinizi yazın..."
            required
            disabled={loading}
            minLength={5}
            maxLength={500}
            rows={4}
          />
          <small className={styles.charCount}>
            {comment.length}/500
          </small>
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !rating || !comment.trim()}
          className={styles.submitButton}
        >
          {loading ? "Göndərilir..." : "Göndər"}
        </button>
      </form>
    </div>
  );
};

export default RatingFormProduct;
