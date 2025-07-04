import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import "./CategoryPreview.css";

const CategoryPreview = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/categories");
        const categoriesData = response.data.categories || response.data;
        
        console.log("🟢 API Response:", response.data);
        console.log("🟢 Categories Data:", categoriesData);
        
        setCategories(categoriesData);
      } catch (err) {
        console.error("❌ Kateqoriyalar yüklənmədi:", err);
        setError("Kateqoriyalar yüklənərkən xəta baş verdi");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="category-preview">
        <div className="category-header">
          <h2 className="category-title">
            <span className="gradient-text">Kateqoriyalar</span>
          </h2>
          <div className="title-decoration"></div>
        </div>
        <div className="category-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="category-card skeleton">
              <div className="category-circle skeleton-circle">
                <div className="category-image skeleton-image"></div>
              </div>
              <div className="category-name skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-preview">
        <div className="category-header">
          <h2 className="category-title">
            <span className="gradient-text">Kateqoriyalar</span>
          </h2>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const displayCategories = categories.slice(0, 5);

  return (
    <div className="category-preview">
      <div className="category-header">
        <h2 className="category-title">
          <span className="gradient-text">Kateqoriyalar</span>
        </h2>
        <div className="title-decoration"></div>
        {categories.length > 6 && (
          <Link to="/categories" className="view-all-btn">
            <span>Hamısını Gör</span>
            <span className="category-count">({categories.length})</span>
            <div className="btn-glow"></div>
          </Link>
        )}
      </div>
      
      <div className="category-grid">
        {displayCategories.length === 0 && (
          <div className="no-categories">
            <div className="no-categories-icon">📦</div>
            <p>Kateqoriya tapılmadı</p>
          </div>
        )}
        {displayCategories.map((category) => {
          const categoryId = category._id;

          if (!category.image) {
            return (
              <div key={categoryId} className="category-card error-card">
                <div className="category-circle">
                  <div className="category-image no-image">
                    <div className="no-image-icon">🏷️</div>
                  </div>
                </div>
                <div className="category-name">{category.name}</div>
              </div>
            );
          }

          return (
            <Link
              key={categoryId}
              to={`/category/${category.name.toLowerCase()}`}
              className="category-card"
            >
              <div className="category-circle">
                <div className="category-image">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    onLoad={() => console.log("✅ Şəkil yükləndi:", category.name)}
                    onError={(e) => {
                      console.error("❌ Şəkil yüklənmədi:", category.name, category.image);
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('error-image');
                    }}
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="category-glow"></div>
              </div>
              <div className="category-name">{category.name}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPreview;
