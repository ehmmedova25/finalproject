import React from "react";
import styles from "./SuccessMessage.module.css";

const SuccessMessage = ({ message }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.box}>
        <div className={styles.checkmark}>✔️</div>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
};

export default SuccessMessage;
