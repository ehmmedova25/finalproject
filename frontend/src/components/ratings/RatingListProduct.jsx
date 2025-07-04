import React, { useEffect, useState } from "react";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";
import styles from "./RatingList.module.css";

const RatingListProduct = ({ initialRatings = [] }) => {
  const [ratings, setRatings] = useState(initialRatings);

  useEffect(() => {
    const handleNewRating = (e) => {
      const newRating = e.detail;
      setRatings((prev) => {
        const existing = prev.find((r) => r.user._id === newRating.user._id);
        if (existing) {
          return prev.map((r) =>
            r.user._id === newRating.user._id ? newRating : r
          );
        } else {
          return [newRating, ...prev];
        }
      });
    };

    window.addEventListener("new-rating-added", handleNewRating);
    return () => window.removeEventListener("new-rating-added", handleNewRating);
  }, []);

  if (!ratings.length) return <p>Hələ heç bir rəy yoxdur.</p>;

  return (
    <div className={styles.reviewList}>
      <h3>Rəylər:</h3>
      {ratings.map((r, i) => (
        <div key={r._id || i} className={styles.reviewItem}>
          <div className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) =>
              i < r.rating ? (
                <FaStar key={i} color="gold" />
              ) : (
                <FaRegStar key={i} color="#ccc" />
              )
            )}
          </div>

          <div className={styles.user}>
            <FaUserCircle className={styles.userIcon} />
            <span>{r.user?.firstName} {r.user?.lastName}</span>
          </div>

          <p>{r.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default RatingListProduct;
