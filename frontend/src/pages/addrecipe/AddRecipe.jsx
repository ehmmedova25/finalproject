import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createRecipe } from "../../redux/reducers/recipeSlice";
import { useNavigate } from "react-router-dom";
import styles from "./AddRecipe.module.css";
import axios from "axios";
import LoadingSpinner from "../../components/loadingspinner/LoadingSpinner";
import SuccessMessage from "../../components/successmessage/SuccessMessage";

const AddRecipe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ text: "", timer: "", video: null }]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/category");
    setCategories(res.data);
  };
  fetchCategories();
}, []);


  const uploadToCloudinary = async (file, type = "image") => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");

    const endpoint =
      type === "video"
        ? "https://api.cloudinary.com/v1_1/dqpxzjfqk/video/upload"
        : "https://api.cloudinary.com/v1_1/dqpxzjfqk/image/upload";

    const res = await axios.post(endpoint, data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imageUrl = image ? await uploadToCloudinary(image, "image") : "";
      const videoUrl = video ? await uploadToCloudinary(video, "video") : "";

      const stepsWithVideoUrls = await Promise.all(
        steps.map(async (step) => {
          const videoUrl = step.video ? await uploadToCloudinary(step.video, "video") : "";
          return {
            text: step.text,
            timer: step.timer,
            videoUrl,
          };
        })
      );

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", imageUrl);
      formData.append("videoUrl", videoUrl);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", JSON.stringify(stepsWithVideoUrls));
      formData.append("category", category); 

      await dispatch(createRecipe(formData)).unwrap();

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/user/recipes");
      }, 2500);
    } catch (err) {
      console.error("Əlavə xətası:", err);
      alert("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Yeni Resept Əlavə Et</h2>

      {uploading && <LoadingSpinner />}
      {showSuccess && <SuccessMessage message="✅ Resept uğurla əlavə olundu!" />}

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Başlıq</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Kateqoriya seç</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">-- Kateqoriya seçin --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Şəkil seç</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />

        <label>Video seç (optional)</label>
        <input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files[0])} />

        <label>Tərkiblər</label>
        {ingredients.map((item, i) => (
          <div key={i} className={styles.inline}>
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const newIngredients = [...ingredients];
                newIngredients[i] = e.target.value;
                setIngredients(newIngredients);
              }}
              required
            />
            <button type="button" onClick={() => setIngredients(ingredients.filter((_, index) => index !== i))}>
              Sil
            </button>
          </div>
        ))}
        <button type="button" onClick={() => setIngredients([...ingredients, ""])}>Tərkib əlavə et</button>

        <label>Addımlar</label>
        {steps.map((step, i) => (
          <div key={i} className={styles.inline}>
            <input
              type="text"
              placeholder={`Addım ${i + 1}`}
              value={step.text}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[i].text = e.target.value;
                setSteps(newSteps);
              }}
              required
            />
            <input
              type="text"
              placeholder="Vaxt (məs: 30 dəqiqə)"
              value={step.timer}
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[i].timer = e.target.value;
                setSteps(newSteps);
              }}
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                const newSteps = [...steps];
                newSteps[i].video = e.target.files[0];
                setSteps(newSteps);
              }}
            />
            <button type="button" onClick={() => setSteps(steps.filter((_, index) => index !== i))}>Sil</button>
          </div>
        ))}
        <button type="button" onClick={() => setSteps([...steps, { text: "", timer: "", video: null }])}>
          Addım əlavə et
        </button>

        <button type="submit" className={styles.submit}>Yadda saxla</button>
      </form>
    </div>
  );
};

export default AddRecipe;
