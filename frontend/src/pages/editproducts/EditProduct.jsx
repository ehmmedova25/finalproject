// 📁 pages/EditProduct/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById, updateProduct } from "../../redux/reducers/productSlice";
import styles from "./EditProduct.module.css";
import axios from "axios";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";
import SuccessMessage from "../../components/successmessage/SuccessMessage";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedProduct, loading } = useSelector((state) => state.products);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState({ value: "Baku", label: "Baku" });

  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔄 Məhsulu və kateqoriyaları gətir
  useEffect(() => {
    dispatch(getProductById(id));
    axios.get("http://localhost:5000/api/category").then((res) => {
      setCategories(res.data);
    });
  }, [dispatch, id]);

  // 🔁 Gələn məhsulu inputlara yerləşdir
  useEffect(() => {
    if (selectedProduct) {
      setName(selectedProduct.name || "");
      setDescription(selectedProduct.description || "");
      setPrice(selectedProduct.price || "");
      setDiscountPrice(selectedProduct.discountPrice || "");
      setStock(selectedProduct.stock || 1);
      setCategory(selectedProduct.category?._id || "");
      setLocation(selectedProduct.location || { value: "Baku", label: "Baku" });
      setExistingImages(selectedProduct.images || []);
    }
  }, [selectedProduct]);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    const res = await axios.post("https://api.cloudinary.com/v1_1/dqpxzjfqk/image/upload", formData);
    return res.data.secure_url;
  };

  const handleRemoveImage = (index) => {
    const updated = [...existingImages];
    updated.splice(index, 1);
    setExistingImages(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedImages = [...existingImages];

      if (images.length > 0) {
        const newUploads = await Promise.all(Array.from(images).map((file) => uploadToCloudinary(file)));
        uploadedImages = [...uploadedImages, ...newUploads];
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("location", JSON.stringify(location));
      uploadedImages.forEach((url) => formData.append("images", url));

      await dispatch(updateProduct({ id, formData })).unwrap();
      setShowSuccess(true);
      setTimeout(() => navigate("/my-products"), 2000);
    } catch (err) {
      alert("❌ Yenilənmə zamanı xəta baş verdi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>📝 Məhsulu Redaktə Et</h2>

      {uploading && <LoadingSpinner />}
      {showSuccess && <SuccessMessage message="✅ Məhsul uğurla yeniləndi!" />}

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

        <label>Mövcud şəkillər:</label>
        <div className={styles.imagePreview}>
          {existingImages.map((img, i) => (
            <div key={i} className={styles.imageItem}>
              <img src={img} alt={`img-${i}`} />
              <button type="button" onClick={() => handleRemoveImage(i)}>❌</button>
            </div>
          ))}
        </div>

        <label>Yeni şəkillər əlavə et:</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} />

        <button type="submit" disabled={uploading}>
          {uploading ? "Yenilənir..." : "Yenilə"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
