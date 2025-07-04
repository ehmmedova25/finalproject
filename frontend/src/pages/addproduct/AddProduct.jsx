import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../redux/reducers/productSlice";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.css";
import axios from "axios";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";
import SuccessMessage from "../../components/successmessage/SuccessMessage";

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("❌ Kateqoriyalar yüklənmədi:", err));

    axios.get("http://localhost:5000/api/locations")
      .then((res) => {
        setLocations(res.data);
        if (res.data.length > 0) setLocation(res.data[0].value);
      })
      .catch((err) => console.error("❌ Lokasiyalar yüklənmədi:", err));
  }, []);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    const res = await axios.post("https://api.cloudinary.com/v1_1/dqpxzjfqk/image/upload", formData);
    return res.data.secure_url;
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedImages = await Promise.all(images.map(uploadToCloudinary));
      const selectedLocation = locations.find((loc) => loc.value === location);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("location", JSON.stringify(selectedLocation));
      uploadedImages.forEach((url) => formData.append("images", url));

      await dispatch(createProduct(formData)).unwrap();
      setShowSuccess(true);
      setTimeout(() => navigate("/shop"), 2000);
    } catch (err) {
      console.error("❌ Əlavə xətası:", err);
      alert("Məhsul əlavə olunarkən xəta baş verdi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>🛒 Yeni Məhsul Əlavə Et</h2>

      {uploading && <LoadingSpinner />}
      {showSuccess && <SuccessMessage message="✅ Məhsul uğurla əlavə olundu!" />}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Məhsul adı *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Açıqlama</label>
        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Qiymət *</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label>Endirimli Qiymət</label>
        <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} />

        <label>Stok</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />

        <label>Kateqoriya *</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">-- Kateqoriya seçin --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <label>Lokasiya *</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        >
          <option value="">-- Lokasiya seçin --</option>
          {locations.map((loc) => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>

        <label>Şəkillər *</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required={images.length === 0}
        />

        <button type="submit" disabled={uploading}>
          {uploading ? "Yüklənir..." : "Əlavə et"}
        </button>

        {images.length > 0 && (
          <div className={styles.previewContainer}>
            {images.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`preview-${i}`}
                className={styles.previewImage}
              />
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddProduct;
