import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axiosInstance";
import styles from "./BannerManagement.module.css";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    link: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axiosInstance.get("/banners");
      setBanners(res.data);
    } catch (err) {
      console.error("Bannerlər alınmadı:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      image: file
    }));
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddBanner = async (e) => {
    e.preventDefault();
    if (!formData.image && !editingBanner) {
      setMessage("❌ Şəkil seçin");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("link", formData.link);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (editingBanner) {
        const res = await axiosInstance.put(`/banners/${editingBanner._id}`, data);
        setMessage("✅ Banner yeniləndi");
        setEditingBanner(null);
      } else {
        const res = await axiosInstance.post("/banners", data);
        setMessage("✅ Banner əlavə olundu");
      }
      
      setFormData({ title: "", link: "", image: null });
      setPreview(null);
      setShowAddForm(false);
      fetchBanners();
      
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Banner xətası:", err);
      setMessage("❌ Əməliyyat uğursuz oldu");
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm("Bu banneri silmək istədiyinizə əminsiniz?")) return;

    try {
      await axiosInstance.delete(`/banners/${id}`);
      setMessage("✅ Banner silindi");
      fetchBanners();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Silinmə xətası:", err);
      setMessage("❌ Banner silinmədi");
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      link: banner.link || "",
      image: null
    });
    setPreview(banner.image);
    setShowAddForm(true);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingBanner(null);
    setFormData({ title: "", link: "", image: null });
    setPreview(null);
  };

  if (loading) return <div className={styles.loading}>Bannerlər yüklənir...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🎨 Banner İdarəetməsi</h2>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "❌ Ləğv et" : "➕ Yeni Banner"}
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${message.includes('❌') ? styles.error : styles.success}`}>
          {message}
        </div>
      )}

      {showAddForm && (
        <div className={styles.formContainer}>
          <h3>{editingBanner ? "✏️ Banneri Redaktə et" : "➕ Yeni Banner Əlavə et"}</h3>
          
          <form onSubmit={handleAddBanner} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Banner Başlığı</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Banner başlığı (isteğe bağlı)"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Link</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="https://example.com (isteğe bağlı)"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Banner Şəkli {!editingBanner && "*"}</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required={!editingBanner}
              />
            </div>

            {preview && (
              <div className={styles.previewContainer}>
                <img src={preview} alt="Preview" className={styles.preview} />
              </div>
            )}

            <div className={styles.formActions}>
              <button type="submit" className={styles.saveButton}>
                {editingBanner ? "💾 Yadda saxla" : "➕ Əlavə et"}
              </button>
              <button type="button" onClick={handleCancelForm} className={styles.cancelButton}>
                ❌ Ləğv et
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.bannerList}>
        <h3>📋 Mövcud Bannerlər ({banners.length})</h3>
        
        {banners.length === 0 ? (
          <div className={styles.empty}>
            <p>Hələlik banner yoxdur. Yeni banner əlavə edin!</p>
          </div>
        ) : (
          <div className={styles.bannerGrid}>
            {banners.map((banner) => (
              <div key={banner._id} className={styles.bannerCard}>
                <div className={styles.bannerImageContainer}>
                  <img src={banner.image} alt={banner.title || "Banner"} />
                  {banner.title && (
                    <div className={styles.bannerTitle}>{banner.title}</div>
                  )}
                </div>
                
                <div className={styles.bannerInfo}>
                  <p><strong>Başlıq:</strong> {banner.title || "Yoxdur"}</p>
                  <p><strong>Link:</strong> {banner.link ? (
                    <a href={banner.link} target="_blank" rel="noopener noreferrer">
                      {banner.link.substring(0, 50)}...
                    </a>
                  ) : "Yoxdur"}</p>
                  <p><strong>Tarix:</strong> {new Date(banner.createdAt).toLocaleDateString('az-AZ')}</p>
                </div>

                <div className={styles.bannerActions}>
                  <button
                    onClick={() => handleEditBanner(banner)}
                    className={styles.editButton}
                  >
                    ✏️ Redaktə
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner._id)}
                    className={styles.deleteButton}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;