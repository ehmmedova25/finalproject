import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css";

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <p>Zəhmət olmasa əvvəlcə daxil olun.</p>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Profil Məlumatları</h2>
      <div className={styles.info}>
        <p><strong>Ad:</strong> {user.firstName}</p>
        <p><strong>Soyad:</strong> {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role === "admin" ? "Admin" : "İstifadəçi"}</p>
      </div>

     
    </div>
  );
};

export default Profile;
