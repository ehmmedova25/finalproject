import React, { useState, useEffect } from "react";
import styles from "./RecipeCard.module.css";
import {
  FaStar,
  FaRegStar,
  FaComment,
  FaUser,
  FaHeart,
  FaRegHeart,
  FaClipboardList,
  FaPlus,
  FaUtensils,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RecipeCard = ({
  recipe,
  isFavorite: initialIsFavorite,
  isToCook: initialIsToCook,
  onToggleFavorite,
  onToggleToCook,
  showCookButton = true,
  showActions = true,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Local state for immediate UI updates
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isToCook, setIsToCook] = useState(initialIsToCook);
  const [isLoading, setIsLoading] = useState(false);

  // Update local state when props change
  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  useEffect(() => {
    setIsToCook(initialIsToCook);
  }, [initialIsToCook]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return navigate("/login");
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      
      // Optimistic update - immediately update UI
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      
      // Call parent function
      const result = await onToggleFavorite(recipe._id);
      
      // If parent function returns a specific result, use it
      if (result !== undefined) {
        setIsFavorite(result);
      }
      
    } catch (error) {
      console.error("Favorite toggle error:", error);
      // Revert optimistic update on error
      setIsFavorite(!isFavorite);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToCookClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return navigate("/login");
    }

    if (isLoading) return;

    try {
      setIsLoading(true);
      
      const newToCookStatus = !isToCook;
      setIsToCook(newToCookStatus);
      
      const result = await onToggleToCook(recipe._id);
      
      if (result !== undefined) {
        setIsToCook(result);
      }
      
    } catch (error) {
      console.error("ToCook toggle error:", error);
      setIsToCook(!isToCook);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCookModeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return navigate("/login");
    navigate(`/cook-mode/${recipe._id}`);
  };

  return (
    <div className={styles.card}>
      <img src={recipe.image} alt={recipe.title} className={styles.image} />
      <h3 className={styles.title}>{recipe.title}</h3>

      {recipe.createdBy && (
        <p className={styles.author}>
          <FaUser /> {recipe.createdBy.firstName} {recipe.createdBy.lastName}
        </p>
      )}

      <div className={styles.stars}>
        {Array.from({ length: 5 }).map((_, i) =>
          i < Math.round(recipe.averageRating || 0) ? (
            <FaStar key={i} color="gold" />
          ) : (
            <FaRegStar key={i} color="#ccc" />
          )
        )}
        <span className={styles.ratingText}>({recipe.averageRating || 0})</span>
      </div>

      <p className={styles.comment}>
        <FaComment /> {recipe.ratings?.length || 0} şərh
      </p>

      <div className={styles.actions}>
        {showActions && (
          <>
            <button
              type="button"
              title={
                isAuthenticated
                  ? isFavorite
                    ? "Favoridən çıxart"
                    : "Favori et"
                  : "Daxil olunmalı"
              }
              onClick={handleFavoriteClick}
              disabled={isLoading}
              className={`${styles.iconButton} ${
                isFavorite ? styles.activeFavorite : ""
              } ${isLoading ? styles.loading : ""}`}
            >
              {isFavorite ? (
                <FaHeart style={{ color: "#ff4757" }} />
              ) : (
                <FaRegHeart style={{ color: "#666" }} />
              )}
            </button>

            <button
              type="button"
              title={
                isAuthenticated
                  ? isToCook
                    ? "Siyahıdan çıxart"
                    : "Bişirəcəyəm"
                  : "Daxil olunmalı"
              }
              onClick={handleToCookClick}
              disabled={isLoading}
              className={`${styles.iconButton} ${
                isToCook ? styles.activeCook : ""
              } ${isLoading ? styles.loading : ""}`}
            >
              {isToCook ? (
                <FaClipboardList style={{ color: "#2ed573" }} />
              ) : (
                <FaPlus style={{ color: "#666" }} />
              )}
            </button>
          </>
        )}

        {showCookButton && (
          <button
            type="button"
            title={isAuthenticated ? "Cook Mode" : "Daxil olunmalı"}
            onClick={handleCookModeClick}
            className={styles.iconButton}
          >
            <FaUtensils style={{ color: "#ffa502" }} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
