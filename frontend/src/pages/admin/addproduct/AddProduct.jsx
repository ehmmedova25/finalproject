import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../redux/reducers/productSlice";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.css";
import axios from "axios";
import LoadingSpinner from "../../../components/loadingspinner/LoadingSpinner";
import SuccessMessage from "../../../components/successmessage/SuccessMessage";

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
  const [measurementType, setMeasurementType] = useState("weight"); 
  const [weightKg, setWeightKg] = useState("");
  const [weightGr, setWeightGr] = useState("");
  const [totalPortions, setTotalPortions] = useState("");
  const [gramsPerPortion, setGramsPerPortion] = useState("");
  const [ingredients, setIngredients] = useState([""]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
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

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedImages = await Promise.all(images.map(uploadToCloudinary));
      const selectedLocation = locations.find((loc) => loc.value === location);

      const totalWeightGr = (parseFloat(weightKg) || 0) * 1000 + (parseFloat(weightGr) || 0);

      const measurementData = {
        type: measurementType,
        totalWeightGr: totalWeightGr > 0 ? totalWeightGr : null,
        weightKg: parseFloat(weightKg) || null,
        weightGr: parseFloat(weightGr) || null,
        totalPortions: parseInt(totalPortions) || null,
        gramsPerPortion: parseFloat(gramsPerPortion) || null
      };

      const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== "");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("location", JSON.stringify(selectedLocation));
      formData.append("measurements", JSON.stringify(measurementData));
      formData.append("ingredients", JSON.stringify(filteredIngredients));
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

        <div className={styles.measurementSection}>
          <h3>📏 Ölçülər</h3>
          
          <label>Ölçü növü</label>
          <select value={measurementType} onChange={(e) => setMeasurementType(e.target.value)}>
            <option value="weight">Yalnız çəki</option>
            <option value="portion">Yalnız porsiya</option>
            <option value="both">Həm çəki, həm porsiya</option>
          </select>

          {(measurementType === "weight" || measurementType === "both") && (
            <div className={styles.weightSection}>
              <h4>⚖️ Çəki</h4>
              <div className={styles.weightInputs}>
                <div>
                  <label>Kiloqram</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label>Qram</label>
                  <input
                    type="number"
                    value={weightGr}
                    onChange={(e) => setWeightGr(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>
              {(weightKg || weightGr) && (
                <p className={styles.totalWeight}>
                  Ümumi çəki: {((parseFloat(weightKg) || 0) * 1000 + (parseFloat(weightGr) || 0))} qram
                </p>
              )}
            </div>
          )}

          {(measurementType === "portion" || measurementType === "both") && (
            <div className={styles.portionSection}>
              <h4>🍽️ Porsiya</h4>
              <div className={styles.portionInputs}>
                <div>
                  <label>Ümumi porsiya sayı</label>
                  <input
                    type="number"
                    value={totalPortions}
                    onChange={(e) => setTotalPortions(e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div>
                  <label>1 porsiya neçə qramdır</label>
                  <input
                    type="number"
                    value={gramsPerPortion}
                    onChange={(e) => setGramsPerPortion(e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>
              {totalPortions && gramsPerPortion && (
                <p className={styles.totalFromPortions}>
                  Porsiyalardan ümumi çəki: {totalPortions * gramsPerPortion} qram
                </p>
              )}
            </div>
          )}
        </div>

        <div className={styles.ingredientsSection}>
          <h3>🧂 Tərkibi</h3>
          {ingredients.map((ingredient, index) => (
            <div key={index} className={styles.ingredientRow}>
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Tərkib maddəsi"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeIngredient(index)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.addIngredientBtn}
            onClick={addIngredient}
          >
            ➕ Tərkib əlavə et
          </button>
        </div>

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
