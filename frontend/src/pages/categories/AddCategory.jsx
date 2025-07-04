import React, { useState } from "react";
import axios from "axios";
import styles from "./AddCategory.module.css";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/category",
        { name, icon },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Kateqoriya uğurla əlavə olundu.");
      setTimeout(() => {
        navigate("/admin/dashboard"); 
      }, 2000);
    } catch (err) {
      console.error("Kateqoriya xətası:", err);
      setMessage("❌ Kateqoriya əlavə edilə bilmədi.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Yeni Kateqoriya Əlavə Et</h2>

      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Kateqoriya Adı *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Icon (optional)</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="Məs: 🍲"
        />

        <button type="submit" className={styles.submit}>Əlavə et</button>
      </form>
    </div>
  );
};

export default AddCategory;
