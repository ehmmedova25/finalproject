import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import styles from "./BestSellersAdmin.module.css";

const BestSellersAdmin = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
 axiosInstance.get("/products/best-sellers")
    .then((res) => setProducts(res.data))
      .catch((err) => console.error("Admin bestseller error:", err.message));
  }, []);

  return (
    <div className={styles.container}>
      <h2>📊 Ən Çox Satılan Məhsullar</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Şəkil</th>
            <th>Ad</th>
            <th>Qiymət</th>
            <th>Satış sayı</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={p._id}>
              <td>{index + 1}</td>
              <td><img src={p.images[0]} alt={p.name} width="50" /></td>
              <td>{p.name}</td>
              <td>{p.discountPrice || p.price} ₼</td>
              <td>{p.totalSold}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BestSellersAdmin;
