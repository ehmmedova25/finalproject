import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import ProductCard from "../../components/productcard/ProductCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError("");

    if (categoryName) {
      axiosInstance
        .get(`/products/category/${categoryName}`)
        .then((res) => {
          if (res.data && res.data.products) {
            setProducts(res.data.products);
            setCategory(res.data.category);
          } else {
            setProducts([]);
          }
        })
        .catch((err) => {
          console.error("❌ Məhsullar yüklənmədi:", err);
          setError("Məhsullar yüklənərkən xəta baş verdi");
        })
        .finally(() => setLoading(false));
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Məhsullar yüklənir...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Yenidən cəhd edin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="category-header">
        {category?.icon && <span className="category-icon">{category.icon}</span>}
        <div>
          <h1>{categoryName?.toUpperCase() || "KATEQORİYA"}</h1>
          <p className="category-stats">{products.length} məhsul tapıldı</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3 className="empty-title">Bu kateqoriyada məhsul yoxdur</h3>
          <p className="empty-description">
            Başqa kateqoriyaları yoxlayın və ya biraz sonra təkrar cəhd edin.
          </p>
          <button
            className="back-to-shop"
            onClick={() => navigate("/shop")}
          >
            Mağazaya qayıt
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;