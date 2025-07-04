import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductById, updateProduct } from "../../../redux/reducers/productSlice";
import axios from "axios";
import styles from "../addproduct/AddProduct.module.css";
import LoadingSpinner from "../../../components/loadingspinner/LoadingSpinner";
import SuccessMessage from "../../../components/successmessage/SuccessMessage";

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: 1,
    category: "",
    location: "",
    measurementType: "weight",
    weightKg: "",
    weightGr: "",
    totalPortions: "",
    gramsPerPortion: "",
    ingredients: [""],
    images: [],
  });
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getProductById(id)).unwrap();
        setProduct(res);
        const m = res.measurements || {};

        setForm({
          name: res.name || "",
          description: res.description || "",
          price: res.price || "",
          discountPrice: res.discountPrice || "",
          stock: res.stock || 1,
          category: res.category?._id || "",
          location: res.location?.[0]?.value || "",
          measurementType: m.type || "weight",
          weightKg: m.weightKg || "",
          weightGr: m.weightGr || "",
          totalPortions: m.totalPortions || "",
          gramsPerPortion: m.gramsPerPortion || "",
          ingredients: res.ingredients?.length ? res.ingredients : [""],
          images: res.images || [],
        });

        const cats = await axios.get("http://localhost:5000/api/categories");
        setCategories(cats.data);
        const locs = await axios.get("http://localhost:5000/api/locations");
        setLocations(locs.data);
      } catch (err) {
        console.error("Məhsul yüklənmədi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, id]);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");
    const res = await axios.post("https://api.cloudinary.com/v1_1/dqpxzjfqk/image/upload", formData);
    return res.data.secure_url;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleIngredientChange = (i, val) => {
    const newList = [...form.ingredients];
    newList[i] = val;
    setForm((prev) => ({ ...prev, ingredients: newList }));
  };

  const addIngredient = () => {
    setForm((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  const removeIngredient = (i) => {
    const newList = form.ingredients.filter((_, index) => index !== i);
    setForm((prev) => ({ ...prev, ingredients: newList }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(handleImageUpload));
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (error) {
      console.error("Şəkil yükləmə xətası:", error);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const selectedLocation = locations.find((l) => l.value === form.location);
    const measurements = {
      type: form.measurementType,
      weightKg: parseFloat(form.weightKg) || null,
      weightGr: parseFloat(form.weightGr) || null,
      totalPortions: parseInt(form.totalPortions) || null,
      gramsPerPortion: parseFloat(form.gramsPerPortion) || null,
    };

    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      discountPrice: form.discountPrice,
      stock: form.stock,
      category: form.category,
      location: selectedLocation, 
      measurements,
      ingredients: form.ingredients.filter((ing) => ing.trim() !== ""),
      images: form.images,
    };

    try {
      await dispatch(updateProduct({ id, updatedData: payload })).unwrap();
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/admin/my-products"), 2000);
    } catch (err) {
      console.error("❌ Redaktə xətası:", err);
      alert("Redaktə zamanı xəta baş verdi");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) return <p>Məhsul tapılmadı</p>;

  return (
    <div className={styles.wrapper}>
      <h2>✏️ Məhsulu Redaktə Et</h2>
      {success && <SuccessMessage message="✅ Məhsul uğurla yeniləndi!" />}
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Məhsul adı *</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Açıqlama</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} />

        <label>Qiymət *</label>
        <input name="price" type="number" value={form.price} onChange={handleChange} required />

        <label>Endirimli qiymət</label>
        <input name="discountPrice" type="number" value={form.discountPrice} onChange={handleChange} />

        <label>Stok</label>
        <input name="stock" type="number" value={form.stock} onChange={handleChange} />

        <label>Kateqoriya</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">-- Seç --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <label>Lokasiya</label>
        <select name="location" value={form.location} onChange={handleChange}>
          <option value="">-- Seç --</option>
          {locations.map((loc) => (
            <option key={loc.value} value={loc.value}>{loc.label}</option>
          ))}
        </select>

        <label>Ölçü növü</label>
        <select name="measurementType" value={form.measurementType} onChange={handleChange}>
          <option value="weight">Yalnız çəki</option>
          <option value="portion">Yalnız porsiya</option>
          <option value="both">Hər ikisi</option>
        </select>

        {(form.measurementType === "weight" || form.measurementType === "both") && (
          <>
            <label>Kiloqram</label>
            <input name="weightKg" type="number" value={form.weightKg} onChange={handleChange} />
            <label>Qram</label>
            <input name="weightGr" type="number" value={form.weightGr} onChange={handleChange} />
          </>
        )}

        {(form.measurementType === "portion" || form.measurementType === "both") && (
          <>
            <label>Ümumi porsiya sayı</label>
            <input name="totalPortions" type="number" value={form.totalPortions} onChange={handleChange} />
            <label>1 porsiya neçə qramdır?</label>
            <input name="gramsPerPortion" type="number" value={form.gramsPerPortion} onChange={handleChange} />
          </>
        )}

        <label>Tərkiblər</label>
        {form.ingredients.map((ingredient, i) => (
          <div key={i} className={styles.ingredientRow}>
            <input
              value={ingredient}
              onChange={(e) => handleIngredientChange(i, e.target.value)}
            />
            {form.ingredients.length > 1 && (
              <button type="button" onClick={() => removeIngredient(i)}>❌</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addIngredient}>➕ Tərkib əlavə et</button>

        <label>Yeni şəkil əlavə et</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        {form.images.length > 0 && (
          <div className={styles.previewContainer}>
            {form.images.map((img, i) => (
              <img key={i} src={img} alt={`img-${i}`} className={styles.previewImage} />
            ))}
          </div>
        )}

        <button type="submit" disabled={uploading}>
          {uploading ? "Yüklənir..." : "Yadda saxla"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
