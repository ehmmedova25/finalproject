import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import ProductCard from "../../../components/productcard/ProductCard";
import styles from "./BestSellersHomepage.module.css";

const BestSellersHomepage = () => {
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await  axiosInstance.get("/products/best-sellers-home")
        setBestSellers(res.data);
      } catch (err) {
        console.error("🔥 Best sellers alınmadı:", err.message);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>🔥 Ən Çox Satılanlar</h2>

      {bestSellers.length === 0 ? (
        <p className={styles.message}>Hələlik ən çox satılan məhsul yoxdur.</p>
      ) : (
        <div className={styles.grid}>
          {bestSellers.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BestSellersHomepage;
