import React from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <p>Zəhmət olmasa daxil olun.</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profil</h2>
      <p><strong>Ad:</strong> {user.firstName}</p>
      <p><strong>Soyad:</strong> {user.lastName}</p>
      <p><strong>İstifadəçi adı:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role === 'seller' ? 'Aşbaz' : 'Müştəri'}</p>
    </div>
  );
};

export default Profile;