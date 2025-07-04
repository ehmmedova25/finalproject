import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/reducers/productSlice";
import ProductCard from "../../components/productcard/ProductCard";
import styles from "./Shop.module.css";
import axiosInstance from "../../api/axiosInstance";

const Shop = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);

  const [locationOptions, setLocationOptions] = useState(["All"]);
  const [categoryOptions, setCategoryOptions] = useState(["All"]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const locRes = await axiosInstance.get("/products/locations");
        const locations = locRes.data || [];
        setLocationOptions(["All", ...locations]);

        const catRes = await axiosInstance.get("/categories");
        const names = catRes.data.map((cat) => cat.name);
        setCategoryOptions(["All", ...names]);
      } catch (err) {
        console.error("Filterlər alınmadı:", err.message);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    dispatch(fetchProducts({ category: selectedCategory, location: selectedLocation }));
  }, [dispatch, selectedCategory, selectedLocation]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>🛍️ Bütün Məhsullar</h2>

      <div className={styles.filters}>
        <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
          {locationOptions.map((loc, idx) => (
            <option key={`loc-${idx}`} value={loc}>
              📍 {loc}
            </option>
          ))}
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categoryOptions.map((cat, idx) => (
            <option key={`cat-${idx}`} value={cat}>
              🗂️ {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Yüklənir...</p>
      ) : error ? (
        <p>Xəta: {error}</p>
      ) : products.length === 0 ? (
        <p>Heç bir məhsul tapılmadı.</p>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
