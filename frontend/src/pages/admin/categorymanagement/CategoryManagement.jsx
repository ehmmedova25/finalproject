import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CategoryManagement.module.css";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    icon: "",
    image: null,
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Kateqoriyalar yüklənmədi:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setMessage("✅ Kateqoriya uğurla silindi");
      fetchCategories();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Silmə xətası:", err);
      setMessage("❌ Kateqoriya silinə bilmədi");
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category._id);
    setEditForm({
      name: category.name,
      icon: category.icon,
      image: null,
    });
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditForm({ name: "", icon: "", image: null });
  };

  const handleImageUpload = async (imageFile) => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      return res.data.url;
    } catch (err) {
      console.error("Şəkil yükləmə xətası:", err);
      return null;
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      let imageUrl = null;

      if (editForm.image) {
        imageUrl = await handleImageUpload(editForm.image);
      }

      const updateData = {
        name: editForm.name,
        icon: editForm.icon,
      };

      if (imageUrl) {
        updateData.image = imageUrl;
      }

      await axios.put(
        `http://localhost:5000/api/categories/${editingCategory}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("✅ Kateqoriya uğurla yeniləndi");
      setEditingCategory(null);
      setEditForm({ name: "", icon: "", image: null });
      fetchCategories();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Yeniləmə xətası:", err);
      setMessage("❌ Kateqoriya yenilənə bilmədi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Kateqoriya İdarəetmə</h2>
      
      {message && <p className={styles.message}>{message}</p>}

      <div className={styles.categoriesGrid}>
        {categories.map((category) => (
          <div key={category._id} className={styles.categoryCard}>
            {editingCategory === category._id ? (
              <form onSubmit={handleUpdate} className={styles.editForm}>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  placeholder="Kateqoriya adı"
                  required
                />
                <input
                  type="text"
                  value={editForm.icon}
                  onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                  placeholder="Icon (emoji)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditForm({...editForm, image: e.target.files[0]})}
                />
                <div className={styles.editButtons}>
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Yenilənir..." : "Yadda saxla"}
                  </button>
                  <button type="button" onClick={cancelEdit}>
                    Ləğv et
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className={styles.categoryInfo}>
                  {category.image && (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className={styles.categoryImage}
                    />
                  )}
                  <div>
                    <h3>
                      {category.icon} {category.name}
                    </h3>
                    <p>Yaradılıb: {new Date(category.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className={styles.actions}>
                  <button 
                    onClick={() => startEdit(category)}
                    className={styles.editBtn}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(category._id)}
                    className={styles.deleteBtn}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManagement;
