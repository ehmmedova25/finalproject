import React from 'react';
import './Categories.css';
import { FaUtensils, FaHamburger, FaSoup, FaLeaf, FaFish, FaDrumstickBite, FaIceCream, FaPizzaSlice, FaCarrot, FaBacon } from 'react-icons/fa';

const categories = [
  { name: "Milli Yeməklər", icon: <FaUtensils /> },
  { name: "Fast Food", icon: <FaHamburger /> },
  { name: "Şorbalar", icon: <FaSoup /> },
  { name: "Salatlar", icon: <FaLeaf /> },
  { name: "Şirniyyatlar", icon: <FaIceCream /> },
  { name: "Vegetarian", icon: <FaCarrot /> },
  { name: "Qəlyanaltılar", icon: <FaPizzaSlice /> },
  { name: "Toyuq yeməkləri", icon: <FaDrumstickBite /> },
  { name: "Ət yeməkləri", icon: <FaBacon /> },
  { name: "Dəniz məhsulları", icon: <FaFish /> }
];

const Categories = () => {
  return (
    <section className="categories-container">
      <h2 className="categories-title">🍽️ Yemək Kateqoriyaları</h2>
      <div className="categories-grid">
        {categories.map((category, idx) => (
          <div key={idx} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
