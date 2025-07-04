import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axiosInstance";
import styles from "./BannerSlider.module.css";

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/banners")
      .then((res) => setBanners(res.data))
      .catch((err) => console.error("Bannerlər alınmadı:", err.message));
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className={styles.sliderWrapper}>
      <div className={styles.slider}>
        {banners.map((banner) => (
          <a
            key={banner._id}
            href={banner.link || "#"}
            className={styles.slide}
          >
            <img src={banner.image} alt={banner.title || "Banner"} />
            {banner.title && (
              <div className={styles.caption}>{banner.title}</div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
