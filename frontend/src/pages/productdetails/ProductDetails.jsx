import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../redux/reducers/productSlice";
import RatingFormProduct from "../../components/ratings/RatingFormProduct";
import RatingListProduct from "../../components/ratings/RatingListProduct";
import ProductZoom from "../../components/productzoom/ProductZoom";
import { addToCart } from "../../redux/reducers/cartSlice";
import { toast } from "react-toastify";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedProduct, loading } = useSelector((state) => state.products);

  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    dispatch(getProductById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setActiveImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  const handleOrder = () => {
    dispatch(addToCart({ productId: selectedProduct._id }))
      .unwrap()
      .then(() => {
        toast.success("Səbətə əlavə olundu");
        navigate("/cart"); 
      })
      .catch(() => toast.error("Səbətə əlavə edilərkən xəta baş verdi"));
  };

  if (loading || !selectedProduct) return <p>Yüklənir...</p>;

  const {
    name,
    description,
    images,
    price,
    discountPrice,
    seller,
    ratings,
    location,
    ingredients,
  } = selectedProduct;

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
                  className={`${styles.thumbnail} ${
                    activeImage === img ? styles.activeThumb : ""
                  }`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoBox}>
          <h2>{name}</h2>
          <p className={styles.price}>
            Qiymət:{" "}
            <strong>
              {discountPrice ? (
                <>
                  <span className={styles.oldPrice}>{price} AZN</span>{" "}
                  <span className={styles.discount}>{discountPrice} AZN</span>
                </>
              ) : (
                `${price} AZN`
              )}
            </strong>
          </p>

          <p className={styles.desc}>{description}</p>
          <p>
            <strong>Satıcı:</strong> {seller?.firstName} {seller?.lastName}
          </p>
          <p>
            <strong>Lokasiya:</strong> {location?.label}
          </p>

          <button className={styles.orderBtn} onClick={handleOrder}>
            SİFARİŞ ET
          </button>
        </div>
      </div>

      {ingredients?.length > 0 && (
        <div className={styles.ingredients}>
          <h3>Tərkibi</h3>
          <ul>
            {ingredients.map((item, index) => (
              <li key={index}>🧂 {item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.ratingSection}>
        <h3>Customer Reviews</h3>
        <RatingFormProduct productId={id} />
        <RatingListProduct initialRatings={ratings} />
      </div>
    </div>
  );
};

export default ProductDetails;
