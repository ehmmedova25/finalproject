import React from "react";
import styles from "./StepCard.module.css";

const formatTime = (input) => {
  if (!input) return "";
  if (typeof input === "string") return input;
  const h = Math.floor(input / 3600);
  const m = Math.floor((input % 3600) / 60);
  const s = input % 60;
  return `${h > 0 ? `${h} saat ` : ""}${m > 0 ? `${m} dəq ` : ""}${s} san`;
};

const StepCard = ({ step, stepIndex, totalSteps }) => (
  <div className={styles.card}>
    <h3>{`Addım ${stepIndex + 1} / ${totalSteps}`}</h3>
    <p>{step.text}</p>
    {step.videoUrl && (
      <video controls className={styles.video}>
        <source src={step.videoUrl} type="video/mp4" />
        Brauzeriniz videonu dəstəkləmir.
      </video>
    )}
    {step.timer && <p className={styles.timer}>Vaxt: {formatTime(step.timer)}</p>}
  </div>
);

export default StepCard;
