import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./RecipeFilter.module.css";

const RecipeFilters = ({ search, setSearch, category, setCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Kategoriya yükləmə xətası:", err));
  }, []);

  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Resept axtar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
  className={styles.select}
>
 <option value="All">Hamısı</option>
{categories.map((cat) => (
  <option key={cat._id} value={cat._id}>
    {cat.name}
  </option>
))}

</select>

    </div>
  );
};

export default RecipeFilters;
