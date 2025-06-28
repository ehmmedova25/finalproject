import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./AddRecipe.module.css";

const AddRecipe = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([{ text: "", timer: "", video: null }]);

  const uploadToCloudinary = async (file, type = "image") => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ml_default");

    const endpoint =
      type === "video"
        ? "https://api.cloudinary.com/v1_1/dqpxzjfqk/video/upload"
        : "https://api.cloudinary.com/v1_1/dqpxzjfqk/image/upload";

    try {
      const res = await axios.post(endpoint, data);
      console.log("Cloudinary cavabı:", res.data);
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary xətası:", err.response?.data || err.message);
      throw new Error("Cloudinary yükləmə xətası");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const imageUrl = await uploadToCloudinary(image, "image");
      const videoUrl = video ? await uploadToCloudinary(video, "video") : "";

      const uploadedSteps = await Promise.all(
        steps.map(async (step) => {
          let videoStepUrl = "";
          if (step.video) {
            videoStepUrl = await uploadToCloudinary(step.video, "video");
          }
          return {
            text: step.text,
            timer: step.timer,
            videoUrl: videoStepUrl,
          };
        })
      );

      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", imageUrl);
      formData.append("video", videoUrl);
      formData.append("ingredients", JSON.stringify(ingredients));
      formData.append("steps", JSON.stringify(uploadedSteps));

      const res = await axios.post("http://localhost:5000/api/recipes", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Resept əlavə olundu!");
      navigate("/recipes");
    } catch (err) {
      console.error("Əsas submit xətası:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Xəta baş verdi");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Yeni Resept Əlavə Et</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Başlıq</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

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
            <button type="button" onClick={() => setIngredients(ingredients.filter((_, index) => index !== i))}>Sil</button>
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
        <button type="button" onClick={() => setSteps([...steps, { text: "", timer: "", video: null }])}>Addım əlavə et</button>

        <button type="submit" className={styles.submit}>Yadda saxla</button>
      </form>
    </div>
  );
};

export default AddRecipe;
