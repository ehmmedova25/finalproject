import { useEffect, useState } from "react";
import axios from "../../api/axios";
import LogoutButton from "../../components/logoutbutton/LogoutButton";
import "./ProfilePage.module.css";
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Profil məlumatları alınarkən xəta:", err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="profile-loading">Məlumatlar yüklənir...</div>;

  return (
    <div className="profile-container">
      <h2>👤 İstifadəçi Profili</h2>
      {user ? (
        <div className="profile-card">
          <p><span>Ad:</span> {user.name}</p>
          <p><span>Email:</span> {user.email}</p>
          <p><span>Qeydiyyat tarixi:</span> {new Date(user.createdAt).toLocaleDateString()}</p>

          <div className="logout-wrapper">
            <LogoutButton />
          </div>
        </div>
      ) : (
        <p className="profile-error">Profil tapılmadı!</p>
      )}
    </div>
  );
};

export default ProfilePage;
