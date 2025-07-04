import React from "react";
import styles from './StepNavigator.module.css';

const StepNavigator = ({ stepIndex, setStepIndex, totalSteps }) => (
  <div className={styles.buttons}>
    <button onClick={() => setStepIndex((i) => Math.max(i - 1, 0))} disabled={stepIndex === 0}>
      ⬅ Əvvəlki
    </button>
    <button onClick={() => setStepIndex((i) => Math.min(i + 1, totalSteps - 1))} disabled={stepIndex === totalSteps - 1}>
      Növbəti ➡
    </button>
  </div>
);

export default StepNavigator;
