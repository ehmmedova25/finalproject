import styles from "./ProductCard.module.css";
import { useNavigate } from "react-router-dom";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/reducers/cartSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await dispatch(addToCart({ productId: product._id })).unwrap();
      toast.success("Səbətə əlavə olundu", { position: "bottom-right", autoClose: 2000 });
    } catch (error) {
      toast.error("Xəta baş verdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  const discountPercentage = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className={`${styles.card} ${isLoading ? styles.loading : ""}`} onClick={handleClick}>
      {discountPercentage > 0 && <div className={styles.discountBadge}>-{discountPercentage}%</div>}

      <div className={styles.imageBox}>
        <img
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        <div className={styles.priceCircle}>
          <span className={styles.currentPrice}>₼{product.discountPrice || product.price}</span>
          {product.discountPrice && <span className={styles.oldPrice}>₼{product.price}</span>}
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <div className={styles.rating}>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  size={12}
                  color={i < Math.round(product.averageRating || 0) ? "#ffd700" : "#e2e8f0"}
                />
              ))}
            </div>
            <span className={styles.ratingValue}>{(product.averageRating || 0).toFixed(1)}</span>
            <span className={styles.reviewCount}>({product.reviewCount || 0})</span>
          </div>
        </div>

        <p className={styles.desc}>
          {product.description?.slice(0, 60)}
          {product.description?.length > 60 && "..."}
        </p>

        <button
          className={styles.orderBtn}
          onClick={handleAddToCart}
          disabled={isLoading}
          aria-label="Add to cart"
        >
          <FaShoppingCart className={styles.cartIcon} />
          <span>{isLoading ? "Əlavə olunur..." : "SƏBƏTƏ ƏLAVƏ ET"}</span>
          {isLoading && <div className={styles.spinner}></div>}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
