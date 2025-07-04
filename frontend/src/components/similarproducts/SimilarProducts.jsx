import React from "react";
import ProductCard from "../productcard/ProductCard";
import styles from "./SimilarProducts.module.css";

const SimilarProducts = ({ products, loading, category }) => {
  if (loading) {
    return (
      <div className={styles.container}>
        <h3>Oxşar Məhsullar</h3>
        <div className={styles.grid}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={styles.skeleton}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonPrice}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className={styles.container}>
        <h3>Oxşar Məhsullar</h3>
        <div className={styles.noProducts}>
          <p>Bu kateqoriyada oxşar məhsul tapılmadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>Oxşar Məhsullar</h3>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
