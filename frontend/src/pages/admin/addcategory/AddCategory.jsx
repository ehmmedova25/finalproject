import React, { useState } from "react";
import axios from "axios";
import styles from "./AddCategory.module.css";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      return res.data.url;
    } catch (err) {
      console.error("🔥 Şəkil yükləmə xətası:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const imageUrl = await handleImageUpload();

      const res = await axios.post(
        "http://localhost:5000/api/categories",
        { name, icon, image: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Kateqoriya uğurla əlavə olundu.");
      setName("");
      setIcon("");
      setImageFile(null);

      setTimeout(() => {
        navigate("/dashboard/admin");
      }, 2000);
    } catch (err) {
      console.error("Kateqoriya xətası:", err);
      if (err.response?.data?.message) {
        setMessage(`❌ ${err.response.data.message}`);
      } else {
        setMessage("❌ Kateqoriya əlavə edilə bilmədi.");
      }
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        />

        <label>Icon (emoji)</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="Məs: 🍔"
          disabled={isLoading}
        />

        <label>Kateqoriya Şəkli *</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          disabled={isLoading}
          required
        />

        <button type="submit" className={styles.submit} disabled={isLoading}>
          {isLoading ? "Əlavə edilir..." : "Əlavə et"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
