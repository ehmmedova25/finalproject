import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getProductById, 
  fetchSimilarProducts, 
  fetchProductsByCategory,
  clearSimilarProducts 
} from "../../redux/reducers/productSlice";
import RatingFormProduct from "../../components/ratings/RatingFormProduct";
import RatingListProduct from "../../components/ratings/RatingListProduct";
import ProductZoom from "../../components/productzoom/ProductZoom";
import SimilarProducts from "../../components/similarproducts/SimilarProducts";
import { addToCart } from "../../redux/reducers/cartSlice";
import { toast } from "react-toastify";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { 
    selectedProduct, 
    similarProducts,
    loading, 
    similarLoading,
    error 
  } = useSelector((state) => state.products);

  const [activeImage, setActiveImage] = useState("");
  const [currentRatings, setCurrentRatings] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
      dispatch(clearSimilarProducts());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setActiveImage(selectedProduct.images[0]);
    }
    if (selectedProduct?.ratings) {
      setCurrentRatings(selectedProduct.ratings);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct && selectedProduct.category) {
      const categoryId = selectedProduct.category._id || selectedProduct.category;
      
      dispatch(fetchSimilarProducts({ 
        categoryId, 
        productId: selectedProduct._id,
        limit: 4 
      })).unwrap().catch(() => {
        dispatch(fetchProductsByCategory({ 
          categoryId, 
          excludeId: selectedProduct._id,
          limit: 4 
        }));
      });
    }
  }, [selectedProduct, dispatch]);

  useEffect(() => {
    const handleNewRating = (event) => {
      const newRating = event.detail;
      if (newRating && newRating.user) {
        setCurrentRatings(prev => [newRating, ...prev]);
      }
    };

    window.addEventListener("new-rating-added", handleNewRating);
    
    return () => {
      window.removeEventListener("new-rating-added", handleNewRating);
    };
  }, []);

  useEffect(() => {
    const handleRatingUpdate = (event) => {
      const updatedRatings = event.detail;
      if (updatedRatings && Array.isArray(updatedRatings)) {
        setCurrentRatings(updatedRatings);
      }
    };

    window.addEventListener("rating-list-updated", handleRatingUpdate);
    
    return () => {
      window.removeEventListener("rating-list-updated", handleRatingUpdate);
    };
  }, []);

  const handleOrder = () => {
    if (!selectedProduct) return;
    
    dispatch(addToCart({ productId: selectedProduct._id }))
      .unwrap()
      .then(() => {
        toast.success("Səbətə əlavə olundu");
        navigate("/cart");
      })
      .catch(() => toast.error("Səbətə əlavə edilərkən xəta baş verdi"));
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {error}</p>;
  if (!selectedProduct) return <p>Məhsul tapılmadı</p>;

  const {
    name,
    description,
    images,
    price,
    discountPrice,
    seller,
    location,
    ingredients,
    stock,
    measurements,
    category
  } = selectedProduct;

  const averageRating = currentRatings?.length > 0 
    ? (currentRatings.reduce((sum, rating) => sum + rating.rating, 0) / currentRatings.length).toFixed(1)
    : 0;

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.imageBox}>
          <ProductZoom image={activeImage} />
          {images?.length > 1 && (
            <div className={styles.thumbnailContainer}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  className={`${styles.thumbnail} ${activeImage === img ? styles.activeThumb : ""}`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoBox}>
          <h2>{name}</h2>
          
          {currentRatings?.length > 0 && (
            <div className={styles.ratingDisplay}>
              <span className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(averageRating) ? styles.filledStar : styles.emptyStar}>
                    ★
                  </span>
                ))}
              </span>
              <span className={styles.ratingText}>
                {averageRating} ({currentRatings.length} rəy)
              </span>
            </div>
          )}

          <p className={styles.price}>
            Qiymət:{" "}
            <strong>
              {discountPrice ? (
                <>
                  <span className={styles.oldPrice}>{price || 0} AZN</span>{" "}
                  <span className={styles.discount}>{discountPrice} AZN</span>
                </>
              ) : (
                `${price || 0} AZN`
              )}
            </strong>
          </p>

          <p className={styles.desc}>{description}</p>

          <div className={styles.productDetails}>
            <div className={styles.detailItem}>
              <strong>Kateqoriya:</strong> {category?.name || "Təyin edilməyib"}
            </div>
            
            <div className={styles.detailItem}>
              <strong>Lokasiya:</strong> {location?.label || "Yoxdur"}
            </div>

            {stock !== undefined && (
              <div className={styles.detailItem}>
                <strong>Stok:</strong> 
                <span className={stock > 0 ? styles.inStock : styles.outOfStock}>
                  {stock > 0 ? `${stock} ədəd mövcuddur` : "Bitib"}
                </span>
              </div>
            )}

            {seller && (
              <div className={styles.detailItem}>
                <strong>Satıcı:</strong> {seller.name || seller.email}
              </div>
            )}
          </div>

          <button 
            className={styles.orderBtn} 
            onClick={handleOrder}
            disabled={stock === 0}
          >
            {stock === 0 ? "STOKDA YOXDUR" : "SİFARİŞ ET"}
          </button>
        </div>
      </div>

      {measurements && (
        <div className={styles.measurementSection}>
          <h3>📏 Ölçülər və Məlumatlar</h3>
          
          {(measurements.type === "weight" || measurements.type === "both") && measurements.totalWeightGr && (
            <div className={styles.weightDisplay}>
              <div className={styles.measurementCard}>
                <span className={styles.measurementIcon}>⚖️</span>
                <div className={styles.measurementContent}>
                  <h4>Çəki Məlumatları</h4>
                  <div className={styles.weightDetails}>
                    {measurements.weightKg && measurements.weightKg > 0 && (
                      <span className={styles.weightItem}>
                        <strong>{measurements.weightKg}</strong> kq
                      </span>
                    )}
                    {measurements.weightGr && measurements.weightGr > 0 && (
                      <span className={styles.weightItem}>
                        <strong>{measurements.weightGr}</strong> qr
                      </span>
                    )}
                  </div>
                  <div className={styles.totalWeightDisplay}>
                    Ümumi çəki: <strong>{measurements.totalWeightGr} qram</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(measurements.type === "portion" || measurements.type === "both") && measurements.totalPortions && (
            <div className={styles.portionDisplay}>
              <div className={styles.measurementCard}>
                <span className={styles.measurementIcon}>🍽️</span>
                <div className={styles.measurementContent}>
                  <h4>Porsiya Məlumatları</h4>
                  <div className={styles.portionDetails}>
                    <div className={styles.portionItem}>
                      <span>Ümumi porsiya sayı:</span>
                      <strong>{measurements.totalPortions} porsiya</strong>
                    </div>
                    {measurements.gramsPerPortion && (
                      <div className={styles.portionItem}>
                        <span>1 porsiya:</span>
                        <strong>{measurements.gramsPerPortion} qram</strong>
                      </div>
                    )}
                    {measurements.totalPortions && measurements.gramsPerPortion && (
                      <div className={styles.portionTotal}>
                        Porsiyalardan ümumi: <strong>{measurements.totalPortions * measurements.gramsPerPortion} qram</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {ingredients?.length > 0 && (
        <div className={styles.ingredients}>
          <h3>🧂 Tərkibi</h3>
          <div className={styles.ingredientsList}>
            {ingredients.map((item, index) => (
              <span key={index} className={styles.ingredientTag}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <SimilarProducts 
        products={similarProducts} 
        loading={similarLoading}
        category={category?.name}
      />

      <div className={styles.ratingSection}>
        <h3>Müştəri Rəyləri</h3>
        <RatingFormProduct 
          productId={id} 
          onRatingAdded={(newRating) => {
            setCurrentRatings(prev => [newRating, ...prev]);
          }}
        />

        <RatingListProduct 
          initialRatings={currentRatings} 
          productId={id}
          onRatingsUpdate={(updatedRatings) => {
            setCurrentRatings(updatedRatings);
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetails;

