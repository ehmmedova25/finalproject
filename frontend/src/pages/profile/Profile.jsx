import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Yeni şifrə və təkrar şifrə uyğun deyil");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/change-password",
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Şifrə dəyişdirilə bilmədi");
    }
  };

  if (!isAuthenticated) return <p>Zəhmət olmasa daxil olun.</p>;

  return (
    <div className="profile-container">
      <h2>Profil</h2>
      <p><strong>Ad:</strong> {user.firstName}</p>
      <p><strong>Soyad:</strong> {user.lastName}</p>
      <p><strong>İstifadəçi adı:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role === 'seller' ? 'Aşbaz' : 'Müştəri'}</p>

      <hr />
      <h3>Şifrəni Dəyiş</h3>
      <form onSubmit={handlePasswordChange}>
        <div>
          <label>Köhnə şifrə:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Yeni şifrə:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Yeni şifrə təkrar:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Dəyiş</button>
      </form>

      <p style={{ marginTop: "1rem" }}>
        Parolu unutmusunuz?{" "}
        <Link to="/forgot-password">
          Bura klikləyin
        </Link>
      </p>
    </div>
  );
};

export default Profile;
