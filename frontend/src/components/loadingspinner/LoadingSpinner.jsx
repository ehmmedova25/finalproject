import React from "react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>⏳ Videolar yüklənir, zəhmət olmasa gözləyin...</p>
    </div>
  );
};

export default LoadingSpinner;
