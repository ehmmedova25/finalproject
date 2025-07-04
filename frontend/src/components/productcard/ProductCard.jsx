
import React from "react";
import styles from "./ProductCard.module.css";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cartSlice";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ productId: product._id }))
      .unwrap()
      .then(() => toast.success("Səbətə əlavə olundu"))
      .catch(() => toast.error("Xəta baş verdi"));
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageBox}>
        <img src={product.images?.[0]} alt={product.name} className={styles.image} />
        <div className={styles.priceCircle}>
          ₼{product.discountPrice || product.price}
          {product.discountPrice && (
            <span className={styles.oldPrice}>₼{product.price}</span>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>

        <div className={styles.rating}>
          <span className={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                size={14}
                color={i < Math.round(product.averageRating || 0) ? "#f1c40f" : "#ddd"}
              />
            ))}
          </span>
          <span className={styles.ratingValue}>
            {(product.averageRating || 0).toFixed(1)}
          </span>
        </div>

        <p className={styles.desc}>
          {product.description?.slice(0, 60) || "Ev üsulu ilə hazırlanmış, dadlı yemək"}
        </p>

        <button className={styles.orderBtn} onClick={handleAddToCart}>
          SƏBƏTƏ ƏLAVƏ ET
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
